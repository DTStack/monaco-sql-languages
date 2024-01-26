/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { languages, Emitter, IEvent, editor, Position, IRange } from './fillers/monaco-editor-core';
import { Suggestions } from 'dt-sql-parser';

interface ILang extends languages.ILanguageExtensionPoint {
	loader: () => Promise<ILangImpl>;
}

interface ILangImpl {
	conf: languages.LanguageConfiguration;
	language: languages.IMonarchLanguage;
}

const languageDefinitions: { [languageId: string]: ILang } = {};
const lazyLanguageLoaders: { [languageId: string]: LazyLanguageLoader } = {};

class LazyLanguageLoader {
	public static getOrCreate(languageId: string): LazyLanguageLoader {
		if (!lazyLanguageLoaders[languageId]) {
			lazyLanguageLoaders[languageId] = new LazyLanguageLoader(languageId);
		}
		return lazyLanguageLoaders[languageId];
	}

	private readonly _languageId: string;
	private _loadingTriggered: boolean;
	private _lazyLoadPromise: Promise<ILangImpl>;
	private _lazyLoadPromiseResolve!: (value: ILangImpl) => void;
	private _lazyLoadPromiseReject!: (err: any) => void;

	constructor(languageId: string) {
		this._languageId = languageId;
		this._loadingTriggered = false;
		this._lazyLoadPromise = new Promise((resolve, reject) => {
			this._lazyLoadPromiseResolve = resolve;
			this._lazyLoadPromiseReject = reject;
		});
	}

	public whenLoaded(): Promise<ILangImpl> {
		return this._lazyLoadPromise;
	}

	public load(): Promise<ILangImpl> {
		if (!this._loadingTriggered) {
			this._loadingTriggered = true;
			languageDefinitions[this._languageId].loader().then(
				(mod) => this._lazyLoadPromiseResolve(mod),
				(err) => this._lazyLoadPromiseReject(err)
			);
		}
		return this._lazyLoadPromise;
	}
}

export async function loadLanguage(languageId: string): Promise<void> {
	await LazyLanguageLoader.getOrCreate(languageId).load();
}

export function registerLanguage(def: ILang): void {
	const languageId = def.id;

	languageDefinitions[languageId] = def;
	languages.register(def);

	const lazyLanguageLoader = LazyLanguageLoader.getOrCreate(languageId);

	languages.setMonarchTokensProvider(
		languageId,
		lazyLanguageLoader.whenLoaded().then((mod) => mod.language)
	);

	languages.onLanguage(languageId, async () => {
		const mod = await lazyLanguageLoader.load();
		languages.setLanguageConfiguration(languageId, mod.conf);
	});
}

export interface ICreateData {
	languageId: string;
}

export interface ModeConfiguration {
	/**
	 * Defines whether the built-in completionItemProvider is enabled.
	 */
	readonly completionItems?: boolean;

	/**
	 * Defines whether the built-in hoverProvider is enabled.
	 */
	readonly hovers?: boolean;

	/**
	 * Defines whether the built-in documentSymbolProvider is enabled.
	 */
	readonly documentSymbols?: boolean;

	/**
	 * Defines whether the built-in definitions provider is enabled.
	 */
	readonly definitions?: boolean;

	/**
	 * Defines whether the built-in references provider is enabled.
	 */
	readonly references?: boolean;

	/**
	 * Defines whether the built-in references provider is enabled.
	 */
	readonly documentHighlights?: boolean;

	/**
	 * Defines whether the built-in rename provider is enabled.
	 */
	readonly rename?: boolean;

	/**
	 * Defines whether the built-in color provider is enabled.
	 */
	readonly colors?: boolean;

	/**
	 * Defines whether the built-in foldingRange provider is enabled.
	 */
	readonly foldingRanges?: boolean;

	/**
	 * Defines whether the built-in diagnostic provider is enabled.
	 */
	readonly diagnostics?: boolean;

	/**
	 * Defines whether the built-in selection range provider is enabled.
	 */
	readonly selectionRanges?: boolean;
}

export interface DiagnosticsOptions {
	readonly validate?: boolean;
}

/**
 * A completion item.
 * ICompletionItem is pretty much the same as {@link languages.CompletionItem},
 * with the only difference being that the range and insertText is optional.
 */
export interface ICompletionItem extends Omit<languages.CompletionItem, 'range' | 'insertText'> {
	range?: IRange | languages.CompletionItemRanges;
	insertText?: string;
}

/**
 * ICompletionList is pretty much the same as {@link languages.CompletionList},
 * with the only difference being that the type of suggestion is {@link ICompletionItem}
 */
export interface ICompletionList extends Omit<languages.CompletionList, 'suggestions'> {
	suggestions: ICompletionItem[];
}

/**
 * A service to build completions.
 * @param model monaco TextModel which triggers completion
 * @param position location that triggers completion
 * @param completionContext context of completion
 * @param suggestions suggestions for completion
 */
export type CompletionService = (
	model: editor.IReadOnlyModel,
	position: Position,
	completionContext: languages.CompletionContext,
	suggestions: Suggestions | null
) => Promise<ICompletionItem[] | ICompletionList>;

export interface LanguageServiceDefaults {
	readonly languageId: string;
	readonly onDidChange: IEvent<LanguageServiceDefaults>;
	readonly diagnosticsOptions: DiagnosticsOptions;
	readonly modeConfiguration: ModeConfiguration;
	readonly completionService?: CompletionService;
	setDiagnosticsOptions(options: DiagnosticsOptions): void;
	setModeConfiguration(modeConfiguration: ModeConfiguration): void;
}

export class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new Emitter<LanguageServiceDefaults>();
	private _diagnosticsOptions!: DiagnosticsOptions;
	private _modeConfiguration!: ModeConfiguration;
	private _languageId: string;
	private _completionService?: CompletionService;

	constructor(
		languageId: string,
		diagnosticsOptions: DiagnosticsOptions,
		modeConfiguration: ModeConfiguration,
		completionService?: CompletionService
	) {
		this._languageId = languageId;
		this.setDiagnosticsOptions(diagnosticsOptions);
		this.setModeConfiguration(modeConfiguration);
		this._completionService = completionService;
	}

	get onDidChange(): IEvent<LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get modeConfiguration(): ModeConfiguration {
		return this._modeConfiguration;
	}

	get diagnosticsOptions(): DiagnosticsOptions {
		return this._diagnosticsOptions;
	}

	get completionService(): CompletionService | undefined {
		return this._completionService;
	}

	setDiagnosticsOptions(options: DiagnosticsOptions): void {
		this._diagnosticsOptions = options || Object.create(null);
		this._onDidChange.fire(this);
	}

	setModeConfiguration(modeConfiguration: ModeConfiguration): void {
		this._modeConfiguration = modeConfiguration || Object.create(null);
		this._onDidChange.fire(this);
	}
}

export const modeConfigurationDefault: Required<ModeConfiguration> = {
	completionItems: true,
	hovers: true,
	documentSymbols: true,
	definitions: true,
	references: true,
	documentHighlights: true,
	rename: true,
	colors: true,
	foldingRanges: true,
	diagnostics: true,
	selectionRanges: true
};

export const diagnosticDefault: Required<DiagnosticsOptions> = {
	validate: true
};
