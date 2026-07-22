import { editor, IDisposable, KeyCode, KeyMod } from './fillers/monaco-editor-core';
import { formatSQL } from './format';
import type { FormatSQLOptions, LanguageServiceDefaults } from './monaco.contribution';

/**
 * Plain text range used by {@link FormatTargetEditor}.
 */
export interface TextRange {
	startLineNumber: number;
	startColumn: number;
	endLineNumber: number;
	endColumn: number;
}

/**
 * Minimal editor surface required by {@link formatEditorSQL}.
 * Kept structural so consumers are not tied to a specific monaco-editor minor version.
 */
export interface FormatTargetEditor {
	getModel(): {
		getLanguageId(): string;
		getValueInRange(range: TextRange): string;
		getFullModelRange(): TextRange;
	} | null;
	getSelection(): (TextRange & { isEmpty(): boolean }) | null;
	pushUndoStop(): void;
	executeEdits(
		source: string | null | undefined,
		edits: Array<{ range: TextRange; text: string }>
	): unknown;
}

function toTextRange(range: TextRange): TextRange {
	return {
		startLineNumber: range.startLineNumber,
		startColumn: range.startColumn,
		endLineNumber: range.endLineNumber,
		endColumn: range.endColumn
	};
}

/**
 * Apply format to the current editor: selection if present, otherwise the whole document.
 * No edit is applied when the formatted result equals the input (unchanged or all format paths failed).
 */
export async function formatEditorSQL(
	codeEditor: FormatTargetEditor,
	options?: FormatSQLOptions
): Promise<void> {
	const model = codeEditor.getModel();
	if (!model) {
		return;
	}
	const selection = codeEditor.getSelection();
	const range = toTextRange(
		selection && !selection.isEmpty() ? selection : model.getFullModelRange()
	);
	const code = model.getValueInRange(range);
	if (!code) {
		return;
	}
	const formatted = await formatSQL(code, model.getLanguageId(), options);
	if (formatted === code) {
		return;
	}
	codeEditor.pushUndoStop();
	codeEditor.executeEdits('format', [{ range, text: formatted }]);
	codeEditor.pushUndoStop();
}

/**
 * Registers a single context-menu "Format" action for the language.
 * Formats selection when present; otherwise formats the whole document.
 * Shortcut: Ctrl/Cmd+Alt+F (avoids Monaco's default Shift+Alt+F Format Document).
 */
const defaultFormatKeybindings = [KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyF];

function getFormatSQLOptions(defaults: LanguageServiceDefaults): FormatSQLOptions {
	const { fallback, tabWidth } = defaults.modeConfiguration.format;
	return { fallback, tabWidth };
}

export function registerFormatAction(defaults: LanguageServiceDefaults): IDisposable {
	const { languageId } = defaults;
	const formatOptions = defaults.modeConfiguration.format;
	const keybindings = formatOptions.keybindings ?? defaultFormatKeybindings;
	return editor.addEditorAction({
		id: `monaco-sql-languages.format.${languageId}`,
		label: 'Format',
		precondition: `editorLangId == '${languageId}'`,
		contextMenuGroupId: '1_modification',
		contextMenuOrder: 1.5,
		keybindings,
		run: async (codeEditor) => {
			await formatEditorSQL(codeEditor, getFormatSQLOptions(defaults));
		}
	});
}
