import { EntityContext, Suggestions } from 'dt-sql-parser';

import { editor, Emitter, IEvent, IRange, languages, Position } from './fillers/monaco-editor-core';

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
	suggestions: Suggestions | null,
	entities: EntityContext[] | null
) => Promise<ICompletionItem[] | ICompletionList>;

export interface CompletionOptions {
	enable: boolean;
	/**
	 * Define a service to customize  completionItems.
	 * By default, only keyword autocomplete items are included.
	 */
	completionService: CompletionService;
	triggerCharacters: string[];
}

export interface ModeConfiguration {
	/**
	 * Defines whether the built-in completionItemProvider is enabled.
	 * Defaults to true.
	 */
	readonly completionItems: CompletionOptions;

	/**
	 * Defines whether the built-in diagnostic provider is enabled.
	 */
	readonly diagnostics: boolean;

	// TODO: Implement the following features
	/**
	 * Defines whether the built-in hoverProvider is enabled.
	 */
	// readonly hovers?: boolean;

	/**
	 * Defines whether the built-in definitions provider is enabled.
	 */
	readonly definitions?: boolean;

	/**
	 * Defines whether the built-in rename provider is enabled.
	 */
	// readonly rename?: boolean;

	/**
	 * Defines whether the built-in references provider is enabled.
	 */
	readonly references?: boolean;
}

/**
 * A function to preprocess code.
 * @param code editor value
 */
export type PreprocessCode = (code: string) => string;

export interface LanguageServiceDefaults {
	readonly languageId: string;
	readonly onDidChange: IEvent<LanguageServiceDefaults>;
	readonly modeConfiguration: ModeConfiguration;
	preprocessCode: PreprocessCode | null;
	completionService: CompletionService;
	triggerCharacters: string[];
	setModeConfiguration(modeConfiguration: ModeConfiguration): void;
}

export class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new Emitter<LanguageServiceDefaults>();
	private _modeConfiguration!: ModeConfiguration;
	private _languageId: string;
	private _preprocessCode: PreprocessCode | null;

	constructor(
		languageId: string,
		modeConfiguration: ModeConfiguration,
		preprocessCode?: PreprocessCode | null
	) {
		this._languageId = languageId;
		this.setModeConfiguration(modeConfiguration);
		this._preprocessCode = preprocessCode ?? null;
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

	get completionService(): CompletionService {
		return this._modeConfiguration.completionItems.completionService;
	}

	get triggerCharacters(): string[] {
		return this._modeConfiguration.completionItems.triggerCharacters;
	}

	get preprocessCode(): PreprocessCode | null {
		return this._preprocessCode;
	}

	setModeConfiguration(modeConfiguration: ModeConfiguration): void {
		this._modeConfiguration = modeConfiguration || Object.create(null);
		this._onDidChange.fire(this);
	}
}

/**
 * A built-in completion service.
 * It will invoke when there is no external completionService.
 * It will only build completion items of keywords.
 */
export const defaultCompletionService: CompletionService = function (
	_model,
	_position,
	_context,
	suggestions
) {
	if (!suggestions) {
		return Promise.resolve([]);
	}
	const { keywords } = suggestions;

	const keywordsCompletionItems: ICompletionItem[] = keywords.map((kw) => ({
		label: kw,
		kind: languages.CompletionItemKind.Keyword,
		detail: 'keyword'
	}));

	return Promise.resolve(keywordsCompletionItems);
};

export const modeConfigurationDefault: Required<ModeConfiguration> = {
	completionItems: {
		enable: true,
		completionService: defaultCompletionService,
		triggerCharacters: ['.', ' ']
	},
	diagnostics: true,
	definitions: true,
	references: true
};
