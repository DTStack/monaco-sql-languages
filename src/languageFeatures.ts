import type { ParseError } from 'dt-sql-parser';
import { ColumnEntityContext, CommonEntityContext, EntityContextType } from 'dt-sql-parser';
import { EntityContext } from 'dt-sql-parser/dist/parser/common/entityCollector';
import { WordPosition } from 'dt-sql-parser/dist/parser/common/textAndWord';
import * as monaco from 'monaco-editor';

import { BaseSQLWorker } from './baseSQLWorker';
import { debounce } from './common/utils';
import {
	CancellationToken,
	editor,
	IDisposable,
	languages,
	MarkerSeverity,
	Position,
	Range,
	Uri
} from './fillers/monaco-editor-core';
import type { CompletionSnippet, LanguageServiceDefaults } from './monaco.contribution';

export interface ColumnInfo {
	/** 字段名 */
	column: string;
	/** 字段类型 */
	type: string | undefined;
	/** 注释 */
	comment?: string;
	/** 别名 */
	alias?: string;
}
export interface WorkerAccessor<T extends BaseSQLWorker> {
	(...uris: Uri[]): Promise<T>;
}

export class DiagnosticsAdapter<T extends BaseSQLWorker> {
	private _disposables: IDisposable[] = [];
	private _listener: { [uri: string]: IDisposable } = Object.create(null);

	constructor(
		private _languageId: string,
		private _worker: WorkerAccessor<T>,
		private readonly _defaults: LanguageServiceDefaults
	) {
		const onModelAdd = (model: editor.IModel): void => {
			let modeId = model.getLanguageId();
			if (modeId !== this._languageId) {
				return;
			}

			this._listener[model.uri.toString()] = model.onDidChangeContent(
				debounce(() => {
					this._doValidate(model.uri, modeId);
				}, 500)
			);

			this._doValidate(model.uri, modeId);
		};

		const onModelRemoved = (model: editor.IModel): void => {
			editor.setModelMarkers(model, this._languageId, []);

			let uriStr = model.uri.toString();
			let listener = this._listener[uriStr];
			if (listener) {
				listener.dispose();
				delete this._listener[uriStr];
			}
		};

		this._disposables.push(editor.onDidCreateModel(onModelAdd));
		this._disposables.push(editor.onWillDisposeModel(onModelRemoved));
		this._disposables.push(
			editor.onDidChangeModelLanguage((event) => {
				onModelRemoved(event.model);
				onModelAdd(event.model);
			})
		);

		this._disposables.push(
			this._defaults.onDidChange((_) => {
				editor.getModels().forEach((model) => {
					if (model.getLanguageId() === this._languageId) {
						onModelRemoved(model);
						onModelAdd(model);
					}
				});
			})
		);

		this._disposables.push({
			dispose: () => {
				for (let key in this._listener) {
					this._listener[key].dispose();
				}
			}
		});

		editor.getModels().forEach(onModelAdd);
	}

	public dispose(): void {
		this._disposables.forEach((d) => d && d.dispose());
		this._disposables = [];
	}

	private _doValidate(resource: Uri, languageId: string): void {
		this._worker(resource)
			.then((worker) => {
				let code = editor.getModel(resource)?.getValue() || '';
				if (typeof this._defaults.preprocessCode === 'function') {
					code = this._defaults.preprocessCode(code);
				}
				return worker.doValidation(code);
			})
			.then((diagnostics) => {
				const markers = diagnostics.map((d) => toDiagnostics(resource, d));
				let model = editor.getModel(resource);
				if (model && model.getLanguageId() === languageId) {
					editor.setModelMarkers(model, languageId, markers);
				}
			})
			.then(undefined, (err) => {
				console.error(err);
			});
	}
}

function toSeverity(lsSeverity?: number): MarkerSeverity {
	switch (lsSeverity) {
		default:
			return MarkerSeverity.Error;
	}
}

function toDiagnostics(_resource: Uri, diag: ParseError): editor.IMarkerData {
	return {
		severity: toSeverity(),
		startLineNumber: diag.startLine,
		startColumn: diag.startColumn,
		endLineNumber: diag.endLine,
		endColumn: diag.endColumn,
		message: diag.message,
		code: undefined, // TODO: set error type
		source: 'dt-sql-parser'
	};
}

export class CompletionAdapter<T extends BaseSQLWorker>
	implements languages.CompletionItemProvider
{
	constructor(
		private readonly _worker: WorkerAccessor<T>,
		private readonly _defaults: LanguageServiceDefaults
	) {}

	public get triggerCharacters(): string[] {
		return Array.isArray(this._defaults.triggerCharacters)
			? this._defaults.triggerCharacters
			: ['.', ' '];
	}

	provideCompletionItems(
		model: editor.IReadOnlyModel,
		position: Position,
		context: languages.CompletionContext,
		_token: CancellationToken
	): Promise<languages.CompletionList> {
		const resource = model.uri;
		return this._worker(resource)
			.then((worker) => {
				let code = editor.getModel(resource)?.getValue() || '';
				if (typeof this._defaults.preprocessCode === 'function') {
					code = this._defaults.preprocessCode(code);
				}
				return worker.doCompletionWithEntities(code, position);
			})
			.then(({ suggestions, allEntities, context: semanticContext }) => {
				let snippets: CompletionSnippet[] = [];
				if (semanticContext?.isStatementBeginning) {
					snippets = this._defaults.completionSnippets.map((item) => ({
						...item,
						insertText: typeof item.body === 'string' ? item.body : item.body.join('\n')
					}));
				}

				return this._defaults.completionService(
					model,
					position,
					context,
					suggestions,
					allEntities,
					snippets
				);
			})
			.then((completions) => {
				const wordInfo = model.getWordUntilPosition(position);
				const wordRange = new Range(
					position.lineNumber,
					wordInfo.startColumn,
					position.lineNumber,
					wordInfo.endColumn
				);
				const unwrappedCompletions = Array.isArray(completions)
					? completions
					: completions.suggestions;
				const completionItems: languages.CompletionItem[] = unwrappedCompletions.map(
					(item) => ({
						...item,
						insertText:
							item.insertText ??
							(typeof item.label === 'string' ? item.label : item.label.label),
						range: item.range ?? wordRange
					})
				);

				return {
					suggestions: completionItems,
					dispose: Array.isArray(completions) ? undefined : completions.dispose,
					incomplete: Array.isArray(completions) ? undefined : completions.incomplete
				};
			});
	}
}
/**
 * The adapter is for the definition of the symbol at the given position and document.
 **/
export class DefinitionAdapter<T extends BaseSQLWorker> implements languages.DefinitionProvider {
	constructor(
		private readonly _worker: WorkerAccessor<T>,
		private readonly _defaults: LanguageServiceDefaults
	) {}
	/**
	 * Provide the definition of the symbol at the given position and document.
	 **/
	provideDefinition(
		model: editor.IReadOnlyModel,
		position: Position,
		_token: CancellationToken
	): languages.ProviderResult<languages.Definition | languages.LocationLink[]> {
		const resource = model.uri;
		const lineContent = model.getLineContent(position.lineNumber);
		if (lineContent.startsWith('--')) return null;
		return this._worker(resource)
			.then((worker) => {
				let code = model?.getValue() || '';
				if (typeof this._defaults.preprocessCode === 'function') {
					code = this._defaults.preprocessCode(code);
				}
				return worker.getAllEntities(code);
			})
			.then((entities) => {
				const word = model.getWordAtPosition(position);
				let pos: WordPosition = {
					line: -1,
					startIndex: -1,
					endIndex: -1,
					startColumn: -1,
					endColumn: -1
				};
				const curEntity = entities?.find((entity: EntityContext) => {
					const entityPosition = entity.position;
					if (
						entityPosition.startColumn === word?.startColumn &&
						entityPosition.endColumn === word?.endColumn &&
						entityPosition.line === position.lineNumber
					) {
						return entity;
					}
					return null;
				});
				if (curEntity) {
					for (let k in entities) {
						const entity = entities[Number(k)];
						if (
							entity.entityContextType.includes('Create') &&
							word?.word &&
							entity.text === word?.word &&
							entity.entityContextType.includes(curEntity.entityContextType)
						) {
							pos = entity.position;
							break;
						}
					}
				}
				if (pos && pos.line !== -1) {
					return {
						uri: model.uri,
						range: new monaco.Range(
							pos?.line,
							pos?.startColumn,
							pos?.line,
							pos?.endColumn
						)
					};
				}
			});
	}
}
/**
 * The adapter is for the references of the symbol at the given position and document.
 **/
export class ReferenceAdapter<T extends BaseSQLWorker> implements languages.ReferenceProvider {
	constructor(
		private readonly _worker: WorkerAccessor<T>,
		private readonly _defaults: LanguageServiceDefaults
	) {}
	/**
	 * Provide a set of project-wide references for the given position and document.
	 **/
	provideReferences(
		model: editor.IReadOnlyModel,
		position: Position,
		_context: languages.ReferenceContext,
		_token: CancellationToken
	): languages.ProviderResult<languages.Location[]> {
		const resource = model.uri;
		const lineContent = model.getLineContent(position.lineNumber);
		if (!lineContent.startsWith('CREATE')) return;
		return this._worker(resource)
			.then((worker) => {
				let code = model?.getValue() || '';
				if (typeof this._defaults.preprocessCode === 'function') {
					code = this._defaults.preprocessCode(code);
				}
				return worker.getAllEntities(model?.getValue());
			})
			.then((entities) => {
				const word = model.getWordAtPosition(position);
				const arr: languages.Location[] = [];
				const curEntity = entities?.find((entity: EntityContext) => {
					const entityPosition = entity.position;
					if (
						entityPosition.startColumn === word?.startColumn &&
						entityPosition.endColumn === word?.endColumn &&
						entityPosition.line === position.lineNumber
					) {
						return entity;
					}
					return null;
				});
				if (curEntity) {
					entities?.forEach((entity) => {
						if (
							word?.word &&
							entity.text === word?.word &&
							curEntity.entityContextType.includes(entity.entityContextType)
						) {
							let pos: WordPosition | null = null;
							pos = entity.position;
							arr.push({
								uri: model.uri,
								range: new monaco.Range(
									pos?.line,
									pos?.startColumn,
									pos?.line,
									pos?.endColumn
								)
							});
						}
					});
				}
				return arr;
			});
	}
}
/**
 * The adapter is for the hover provider interface defines the contract between extensions and
 * the [hover](https://code.visualstudio.com/docs/editor/intellisense)-feature.
 **/
export class HoverAdapter<T extends BaseSQLWorker> implements languages.HoverProvider {
	constructor(
		private readonly _worker: WorkerAccessor<T>,
		private readonly _defaults: LanguageServiceDefaults
	) {}
	provideHover(
		model: editor.IReadOnlyModel,
		position: Position,
		_token: CancellationToken
	): languages.ProviderResult<languages.Hover> {
		const resource = model.uri;
		const lineContent = model.getLineContent(position.lineNumber);
		if (lineContent.trim().startsWith('--')) return null;
		return this._worker(resource)
			.then((worker) => {
				let code = model?.getValue() || '';
				if (typeof this._defaults.preprocessCode === 'function') {
					code = this._defaults.preprocessCode(code);
				}
				return worker.getAllEntities(code, position);
			})
			.then((entities) => {
				if (!entities || !entities.length) return null;
				let isAlias = false;
				const curEntity = entities.find((entity: EntityContext) => {
					const p = entity.position;
					const alias = entity._alias;
					isAlias = !!(
						alias &&
						alias.startColumn <= position.column &&
						alias.endColumn >= position.column &&
						alias.line === position.lineNumber
					);
					return (
						(p.startColumn <= position.column &&
							p.endColumn >= position.column &&
							p.line === position.lineNumber) ||
						isAlias
					);
				});
				if (!curEntity) return null;
				const tableCreate = findTableCreateEntity(curEntity, entities);
				const columns = tableCreate ? toColumnsInfo(tableCreate) || [] : [];
				const columnsDesc = columns.reduce((res, cur) => {
					const { column, type, comment, alias } = cur;
					return (
						res +
						`\`${column}\` ${type ? `&nbsp;&nbsp; **${type}**` : ''} ${
							comment ? `&nbsp;&nbsp; *${comment}*` : ''
						} ${alias ? `&nbsp;&nbsp; *${alias}*` : ''} \n`
					);
				}, '');
				const tableText = isAlias
					? (curEntity._alias?.text ?? curEntity.text)
					: curEntity.text;
				let range: monaco.Range;
				if (isAlias && curEntity._alias) {
					range = new monaco.Range(
						curEntity._alias.line,
						curEntity._alias.startColumn,
						curEntity._alias.line,
						curEntity._alias.endColumn
					);
				} else {
					const p = curEntity.position;
					range = new monaco.Range(p.line, p.startColumn, p.line, p.endColumn);
				}
				const contents: monaco.IMarkdownString[] = [
					{ value: `**${tableText}**` },
					{ value: columnsDesc }
				];
				return { contents, range };
			});
	}
}

/**
 * According to the table name or table entity field, get the corresponding create table information
 */
export function findTableCreateEntity(
	tableEntity: EntityContext | string,
	allEntities: EntityContext[]
): CommonEntityContext | null {
	if (
		typeof tableEntity !== 'string' &&
		tableEntity.entityContextType !== EntityContextType.TABLE
	) {
		return null;
	}

	const tableName: string = typeof tableEntity === 'string' ? tableEntity : tableEntity.text;
	function removeQuotes(str: string): string {
		return str.replace(/^['"`“”‘’«»]|['"`“”‘’«»]$/g, '');
	}
	return (
		allEntities.find(
			(en): en is CommonEntityContext =>
				en.entityContextType === EntityContextType.TABLE_CREATE &&
				removeQuotes(en.text) === removeQuotes(tableName)
		) ?? null
	);
}

/**
 * Transform table create entity to columns info
 */
export function toColumnsInfo(tableEntity: CommonEntityContext): ColumnInfo[] | null {
	if (
		!tableEntity ||
		tableEntity.entityContextType !== EntityContextType.TABLE_CREATE ||
		!tableEntity.columns?.length
	)
		return null;
	const columnsInfo: ColumnInfo[] = [];
	tableEntity.columns.forEach((col: ColumnEntityContext) => {
		columnsInfo.push({
			column: col.text,
			type: col._colType?.text,
			comment: col._comment?.text,
			alias: col._alias?.text
		});
	});
	return columnsInfo;
}
