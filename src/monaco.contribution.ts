import { languages, Emitter, IEvent, editor, Position, IRange } from './fillers/monaco-editor-core';
import { EntityContext, Suggestions } from 'dt-sql-parser';

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

/**
 * A function to preprocess code.
 * @param code editor value
 */
export type PreprocessCode = (code: string) => string;

export interface LanguageServiceDefaults {
	readonly languageId: string;
	readonly onDidChange: IEvent<LanguageServiceDefaults>;
	readonly modeConfiguration: ModeConfiguration;
	readonly completionService?: CompletionService;
	readonly preprocessCode?: PreprocessCode;
	setModeConfiguration(modeConfiguration: ModeConfiguration): void;
}

export class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new Emitter<LanguageServiceDefaults>();
	private _modeConfiguration!: ModeConfiguration;
	private _languageId: string;
	private _completionService?: CompletionService;
	private _preprocessCode?: PreprocessCode;

	constructor(
		languageId: string,
		modeConfiguration: ModeConfiguration,
		completionService?: CompletionService,
		preprocessCode?: PreprocessCode
	) {
		this._languageId = languageId;
		this.setModeConfiguration(modeConfiguration);
		this._completionService = completionService;
		this._preprocessCode = preprocessCode;
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

	get completionService(): CompletionService | undefined {
		return this._completionService;
	}

	get preprocessCode(): PreprocessCode | undefined {
		return this._preprocessCode;
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
