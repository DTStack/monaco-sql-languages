import type { PreprocessCode } from '../monaco.contribution';
import type { editor, IDisposable } from '../fillers/monaco-editor-core';

export interface RunStatementButtonThemeColors {
	normal: string;
	hover: string;
}

export interface RunStatementButtonThemePalette {
	dark?: RunStatementButtonThemeColors;
	light?: RunStatementButtonThemeColors;
	hc?: RunStatementButtonThemeColors;
}

export interface StatementRange {
	/**
	 * Gutter icon line (1-based). Skips leading blank lines and comments — not necessarily `startLineNumber`.
	 * Built-in and normalized custom resolvers compute this automatically.
	 */
	executableLineNumber: number;
	/** Full statement text passed to `onRun`. */
	text: string;
	/** Statement block start line (1-based, may include leading comments). */
	startLineNumber: number;
	endLineNumber: number;
	startColumn: number;
	endColumn: number;
}

export interface RunStatementContext {
	statement: StatementRange;
	editor: editor.IStandaloneCodeEditor;
	model: editor.ITextModel;
}

/**
 * Custom statement resolver. When provided, it fully replaces the built-in splitter.
 * Return ranges with accurate `startLineNumber` / `text`; `executableLineNumber` is normalized automatically.
 */
export type GetStatementRanges = (
	code: string,
	languageId?: string
) => StatementRange[] | Promise<StatementRange[]>;

export type ShouldShowRunButton = (statement: StatementRange) => boolean;

export interface RunStatementButtonOptions {
	editor: editor.IStandaloneCodeEditor;
	/**
	 * SQL language id, e.g. {@link LanguageIdEnum.FLINK}.
	 * Used by the built-in statement splitter when `getStatementRanges` is not provided.
	 */
	languageId?: string;
	/** Called when the run icon is clicked. Async errors are logged to the console. */
	onRun: (context: RunStatementContext) => void | Promise<void>;
	/** Custom statement resolver. See {@link GetStatementRanges}. */
	getStatementRanges?: GetStatementRanges;
	/**
	 * Whether to show the run icon for a statement.
	 * Defaults to statements that contain at least one non-whitespace, non-semicolon character.
	 */
	shouldShowRunButton?: ShouldShowRunButton;
	/** CSS class applied to the glyph margin icon. */
	glyphMarginClassName?: string;
	/** Hover message shown on the run icon. No hover text when omitted. */
	glyphMarginHoverMessage?: string | { value: string };
	/** Debounce duration for content updates in milliseconds. Defaults to 200. */
	debounceMs?: number;
	/** Whether to enable glyph margin on the editor. Defaults to true. */
	enableGlyphMargin?: boolean;
	/**
	 * Preprocess code before resolving statements.
	 * Must preserve line-number alignment with the editor model (do not insert/delete lines);
	 * otherwise gutter icons may land on the wrong lines.
	 */
	preprocessCode?: PreprocessCode | null;
	/** Inject default run icon styles into the document. Defaults to true. */
	injectDefaultStyles?: boolean;
	/** Custom icon colors per editor theme base (vs-dark / vs / hc). */
	themeColors?: RunStatementButtonThemePalette;
}

export interface RunStatementButtonController extends IDisposable {
	/** Recompute statement ranges and refresh gutter icons. */
	refresh(): void;
}
