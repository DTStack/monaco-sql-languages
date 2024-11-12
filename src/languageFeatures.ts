import type { ParseError } from 'dt-sql-parser';
import {
	EntityContext,
} from 'dt-sql-parser/dist/parser/common/entityCollector';
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
	Uri,
} from './fillers/monaco-editor-core';
import type { LanguageServiceDefaults } from './monaco.contribution';

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
			.then(([suggestions, allEntities]) => {
				return this._defaults.completionService(
					model,
					position,
					context,
					suggestions,
					allEntities
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

export class DefinitionAdapter<T extends BaseSQLWorker> implements languages.DefinitionProvider {
	constructor(
		private readonly _worker: WorkerAccessor<T>,
		private readonly _defaults: LanguageServiceDefaults) {}
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
				entities?.forEach((entity: EntityContext) => {
					if (
						entity.entityContextType.includes('Create') &&
						word?.word &&
						entity.text === word?.word
					) {
						pos = entity.position;
					}
				});
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

export class ReferenceAdapter<T extends BaseSQLWorker> implements languages.ReferenceProvider {
	constructor(
		private readonly _worker: WorkerAccessor<T>,
		private readonly _defaults: LanguageServiceDefaults
	) {}
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
				entities?.forEach((entity) => {
					if (word?.word && entity.text === word?.word) {
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
				return arr;
			});
	}
}
