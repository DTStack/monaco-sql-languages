import { debounce } from '../common/utils';
import { editor, IDisposable, Range } from '../fillers/monaco-editor-core';
import { getStatementRangesByLanguage, normalizeStatementRanges } from './statementRanges';
import { DEFAULT_RUN_GLYPH_CLASS_NAME, injectRunStatementButtonStyles } from './styles';
import type {
	RunStatementButtonController,
	RunStatementButtonOptions,
	RunStatementContext,
	StatementRange
} from './types';

/** Hide run icons for blank or semicolon-only fragments (e.g. `;;;`). */
function defaultShouldShowRunButton(statement: StatementRange): boolean {
	return /[^\s;]/.test(statement.text);
}

function toHoverMessage(
	message: string | { value: string } | undefined
): { value: string } | undefined {
	if (!message) {
		return undefined;
	}
	return typeof message === 'string' ? { value: message } : message;
}

function isEditorReadOnly(codeEditor: editor.IStandaloneCodeEditor): boolean {
	return codeEditor.getOption(editor.EditorOption.readOnly);
}

export function createRunStatementButton(
	options: RunStatementButtonOptions
): RunStatementButtonController {
	const {
		editor: codeEditor,
		languageId,
		onRun,
		getStatementRanges,
		shouldShowRunButton = defaultShouldShowRunButton,
		glyphMarginClassName = DEFAULT_RUN_GLYPH_CLASS_NAME,
		glyphMarginHoverMessage,
		debounceMs = 200,
		enableGlyphMargin = true,
		preprocessCode,
		injectDefaultStyles = true,
		themeColors
	} = options;

	if (injectDefaultStyles) {
		injectRunStatementButtonStyles(glyphMarginClassName, themeColors);
	}

	if (enableGlyphMargin) {
		codeEditor.updateOptions({ glyphMargin: true });
	}

	const disposables: IDisposable[] = [];
	let decorationCollection: editor.IEditorDecorationsCollection | null = null;
	let lineToStatementMap = new Map<number, StatementRange>();
	let refreshRequestId = 0;
	let disposed = false;

	const resolveStatements = (code: string): StatementRange[] | Promise<StatementRange[]> => {
		const resolvedLanguageId = languageId ?? codeEditor.getModel()?.getLanguageId();
		if (typeof getStatementRanges === 'function') {
			return Promise.resolve(getStatementRanges(code, resolvedLanguageId)).then(
				normalizeStatementRanges
			);
		}
		return getStatementRangesByLanguage(code, resolvedLanguageId, preprocessCode);
	};

	const applyDecorations = (statements: StatementRange[]) => {
		lineToStatementMap = new Map();
		const decorations: editor.IModelDeltaDecoration[] = [];

		if (isEditorReadOnly(codeEditor)) {
			decorationCollection?.set([]);
			return;
		}

		statements.forEach((statement) => {
			if (!shouldShowRunButton(statement)) {
				return;
			}
			const { executableLineNumber } = statement;
			const existing = lineToStatementMap.get(executableLineNumber);
			if (existing) {
				console.warn(
					'[monaco-sql-languages] Multiple run statements share executable line',
					executableLineNumber,
					{ previous: existing.text, current: statement.text }
				);
			}
			lineToStatementMap.set(executableLineNumber, statement);
			decorations.push({
				range: new Range(executableLineNumber, 1, executableLineNumber, 1),
				options: {
					glyphMarginClassName,
					glyphMarginHoverMessage: toHoverMessage(glyphMarginHoverMessage)
				}
			});
		});

		if (decorationCollection) {
			decorationCollection.set(decorations);
		} else {
			decorationCollection = codeEditor.createDecorationsCollection(decorations);
		}
	};

	const refresh = () => {
		if (disposed) {
			return;
		}

		const model = codeEditor.getModel();
		if (!model) {
			lineToStatementMap.clear();
			decorationCollection?.clear();
			return;
		}

		const currentRequestId = ++refreshRequestId;

		void Promise.resolve(resolveStatements(model.getValue()))
			.then((statements) => {
				if (disposed || currentRequestId !== refreshRequestId) {
					return;
				}
				applyDecorations(statements);
			})
			.catch((error) => {
				console.error(
					'[monaco-sql-languages] Failed to resolve run statement ranges:',
					error
				);
			});
	};

	const scheduleRefresh = debounce(() => {
		refresh();
	}, debounceMs);

	const handleMouseDown = codeEditor.onMouseDown((event) => {
		if (isEditorReadOnly(codeEditor)) {
			return;
		}
		if (event.target.type !== editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
			return;
		}
		const lineNumber = event.target.position?.lineNumber;
		if (!lineNumber) {
			return;
		}

		const statement = lineToStatementMap.get(lineNumber);
		if (!statement) {
			return;
		}

		event.event.preventDefault();
		event.event.stopPropagation();

		const model = codeEditor.getModel();
		if (!model) {
			return;
		}

		const context: RunStatementContext = {
			statement,
			editor: codeEditor,
			model
		};
		void Promise.resolve()
			.then(() => onRun(context))
			.catch((error) => {
				console.error('[monaco-sql-languages] Run statement handler failed:', error);
			});
	});

	const handleModelChange = codeEditor.onDidChangeModel(() => {
		scheduleRefresh();
	});

	const handleModelLanguageChange = codeEditor.onDidChangeModelLanguage(() => {
		scheduleRefresh();
	});

	const handleContentChange = codeEditor.onDidChangeModelContent(() => {
		scheduleRefresh();
	});

	const handleConfigurationChange = codeEditor.onDidChangeConfiguration((event) => {
		if (event.hasChanged(editor.EditorOption.readOnly)) {
			scheduleRefresh();
		}
	});

	disposables.push(
		handleMouseDown,
		handleModelChange,
		handleModelLanguageChange,
		handleContentChange,
		handleConfigurationChange
	);

	refresh();

	return {
		refresh,
		dispose: () => {
			disposed = true;
			refreshRequestId += 1;
			scheduleRefresh.cancel();
			disposables.forEach((item) => item.dispose());
			decorationCollection?.clear();
			decorationCollection = null;
			lineToStatementMap.clear();
		}
	};
}

export {
	DEFAULT_RUN_GLYPH_CLASS_NAME,
	DEFAULT_RUN_BUTTON_THEME_PALETTE,
	injectRunStatementButtonStyles
} from './styles';
export {
	getStatementRangesByLanguage,
	normalizeStatementRange,
	normalizeStatementRanges
} from './statementRanges';
export type {
	RunStatementButtonOptions,
	RunStatementButtonController,
	RunStatementContext,
	RunStatementButtonThemeColors,
	RunStatementButtonThemePalette,
	StatementRange,
	GetStatementRanges,
	ShouldShowRunButton
} from './types';
