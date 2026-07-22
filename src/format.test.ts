import * as assert from 'assert';

import { LanguageIdEnum } from './common/constants';
import { formatSQL, __configureSqlFormatterLoaderForTests } from './format';
import { formatEditorSQL, type FormatTargetEditor, type TextRange } from './formatEditor';

/** Invalid input that makes sql-formatter throw a parse error. */
const INVALID_SQL = '@@@!!!';

test('formatSQL formats valid mysql sql', async () => {
	const input = 'select id,name from users where id=1';
	const result = await formatSQL(input, LanguageIdEnum.MYSQL);
	assert.notStrictEqual(result, input);
	assert.ok(result.toLowerCase().includes('select'));
	assert.ok(result.toLowerCase().includes('from'));
});

test('formatSQL formats dialects with dedicated sql-formatter languages', async () => {
	const input = 'select a from t';
	const dialects = [
		LanguageIdEnum.MYSQL,
		LanguageIdEnum.PG,
		LanguageIdEnum.SPARK,
		LanguageIdEnum.HIVE,
		LanguageIdEnum.TRINO
	];
	for (const languageId of dialects) {
		const result = await formatSQL(input, languageId);
		assert.ok(result.toLowerCase().includes('select'), languageId);
		assert.ok(result.toLowerCase().includes('from'), languageId);
	}
});

test('formatSQL formats dialects mapped to standard sql', async () => {
	const input = 'select a from t';
	for (const languageId of [
		LanguageIdEnum.FLINK,
		LanguageIdEnum.IMPALA,
		LanguageIdEnum.GENERIC
	]) {
		const result = await formatSQL(input, languageId);
		assert.ok(result.toLowerCase().includes('select'), languageId);
	}
});

test('formatSQL falls back to standard sql for unknown languageId', async () => {
	const input = 'select a from t';
	const result = await formatSQL(input, 'unknown-sql');
	assert.ok(result.toLowerCase().includes('select'));
});

test('formatSQL uses async fallback when formatting fails', async () => {
	const fallbackResult = 'SELECT 1';
	const result = await formatSQL(INVALID_SQL, LanguageIdEnum.MYSQL, {
		fallback: async () => fallbackResult
	});
	assert.strictEqual(result, fallbackResult);
});

test('formatSQL uses sync fallback when formatting fails', async () => {
	const fallbackResult = 'SELECT 2';
	const result = await formatSQL(INVALID_SQL, LanguageIdEnum.MYSQL, {
		fallback: () => fallbackResult
	});
	assert.strictEqual(result, fallbackResult);
});

test('formatSQL passes code and languageId to fallback', async () => {
	let receivedCode = '';
	let receivedLanguageId = '';
	await formatSQL(INVALID_SQL, LanguageIdEnum.PG, {
		fallback: (code, languageId) => {
			receivedCode = code;
			receivedLanguageId = languageId;
			return 'SELECT 1';
		}
	});
	assert.strictEqual(receivedCode, INVALID_SQL);
	assert.strictEqual(receivedLanguageId, LanguageIdEnum.PG);
});

test('formatSQL returns original code when formatting fails without fallback', async () => {
	const result = await formatSQL(INVALID_SQL, LanguageIdEnum.MYSQL);
	assert.strictEqual(result, INVALID_SQL);
});

test('formatSQL returns original code when fallback also fails', async () => {
	const result = await formatSQL(INVALID_SQL, LanguageIdEnum.MYSQL, {
		fallback: () => {
			throw new Error('fallback failed');
		}
	});
	assert.strictEqual(result, INVALID_SQL);
});

test('formatSQL returns empty string for empty input', async () => {
	const result = await formatSQL('', LanguageIdEnum.MYSQL);
	assert.strictEqual(result, '');
});

test('formatSQL uses fallback when sql-formatter is unavailable', async () => {
	__configureSqlFormatterLoaderForTests(async () => null);
	try {
		const result = await formatSQL('select 1', LanguageIdEnum.MYSQL, {
			fallback: () => 'FROM FALLBACK'
		});
		assert.strictEqual(result, 'FROM FALLBACK');
	} finally {
		__configureSqlFormatterLoaderForTests(undefined);
	}
});

test('formatSQL passes tabWidth to sql-formatter', async () => {
	__configureSqlFormatterLoaderForTests(async () => ({
		format: (_query, cfg) => String(cfg?.tabWidth ?? '')
	}));
	try {
		const result = await formatSQL('select 1', LanguageIdEnum.MYSQL, { tabWidth: 2 });
		assert.strictEqual(result, '2');
		const defaultResult = await formatSQL('select 1', LanguageIdEnum.MYSQL);
		assert.strictEqual(defaultResult, '4');
	} finally {
		__configureSqlFormatterLoaderForTests(undefined);
	}
});

test('formatSQL clamps invalid tabWidth to default', async () => {
	__configureSqlFormatterLoaderForTests(async () => ({
		format: (_query, cfg) => String(cfg?.tabWidth ?? '')
	}));
	try {
		for (const tabWidth of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, 1.9]) {
			const result = await formatSQL('select 1', LanguageIdEnum.MYSQL, { tabWidth });
			assert.strictEqual(result, tabWidth === 1.9 ? '1' : '4', String(tabWidth));
		}
	} finally {
		__configureSqlFormatterLoaderForTests(undefined);
	}
});

function createMockEditor(options: {
	code: string;
	languageId?: string;
	selection?: (TextRange & { isEmpty(): boolean }) | null;
}): FormatTargetEditor & {
	edits: Array<{ range: TextRange; text: string }>;
	undoStopCount: number;
} {
	const { code, languageId = LanguageIdEnum.MYSQL, selection = null } = options;
	const fullRange: TextRange = {
		startLineNumber: 1,
		startColumn: 1,
		endLineNumber: 1,
		endColumn: Math.max(code.length, 0) + 1
	};
	const edits: Array<{ range: TextRange; text: string }> = [];
	let undoStopCount = 0;

	return {
		edits,
		get undoStopCount() {
			return undoStopCount;
		},
		getModel: () => ({
			getLanguageId: () => languageId,
			getValueInRange: (range) => {
				if (
					range.startLineNumber === fullRange.startLineNumber &&
					range.startColumn === fullRange.startColumn &&
					range.endLineNumber === fullRange.endLineNumber &&
					range.endColumn === fullRange.endColumn
				) {
					return code;
				}
				// Approximate single-line slice for selection tests
				return code.slice(range.startColumn - 1, range.endColumn - 1);
			},
			getFullModelRange: () => fullRange
		}),
		getSelection: () => selection,
		pushUndoStop: () => {
			undoStopCount += 1;
		},
		executeEdits: (_source, nextEdits) => {
			edits.push(...nextEdits);
		}
	};
}

test('formatEditorSQL formats whole document when selection is empty', async () => {
	const input = 'select id,name from users';
	const editor = createMockEditor({
		code: input,
		selection: {
			startLineNumber: 1,
			startColumn: 1,
			endLineNumber: 1,
			endColumn: 1,
			isEmpty: () => true
		}
	});

	await formatEditorSQL(editor);

	assert.strictEqual(editor.edits.length, 1);
	assert.notStrictEqual(editor.edits[0].text, input);
	assert.ok(editor.edits[0].text.toLowerCase().includes('select'));
	assert.strictEqual(editor.undoStopCount, 2);
});

test('formatEditorSQL formats selection when present', async () => {
	const selected = 'select id,name from users';
	const editor = createMockEditor({
		code: selected,
		selection: {
			startLineNumber: 1,
			startColumn: 1,
			endLineNumber: 1,
			endColumn: selected.length + 1,
			isEmpty: () => false
		}
	});

	await formatEditorSQL(editor);

	assert.strictEqual(editor.edits.length, 1);
	assert.notStrictEqual(editor.edits[0].text, selected);
	assert.ok(editor.edits[0].text.toLowerCase().includes('from'));
});

test('formatEditorSQL formats only the selected slice of a longer document', async () => {
	const prefix = 'keep ';
	const selected = 'select 1';
	const suffix = ' intact';
	const code = `${prefix}${selected}${suffix}`;
	const startColumn = prefix.length + 1;
	const endColumn = startColumn + selected.length;
	const selectionRange: TextRange = {
		startLineNumber: 1,
		startColumn,
		endLineNumber: 1,
		endColumn
	};

	__configureSqlFormatterLoaderForTests(async () => ({
		format: (query) => {
			assert.strictEqual(query, selected);
			return 'SELECT\n    1';
		}
	}));
	try {
		const editor = createMockEditor({
			code,
			selection: {
				...selectionRange,
				isEmpty: () => false
			}
		});

		await formatEditorSQL(editor);

		assert.strictEqual(editor.edits.length, 1);
		assert.deepStrictEqual(editor.edits[0].range, selectionRange);
		assert.strictEqual(editor.edits[0].text, 'SELECT\n    1');
	} finally {
		__configureSqlFormatterLoaderForTests(undefined);
	}
});

test('formatEditorSQL no-ops when model is missing', async () => {
	const edits: Array<{ range: TextRange; text: string }> = [];
	const editor: FormatTargetEditor = {
		getModel: () => null,
		getSelection: () => null,
		pushUndoStop: () => {
			throw new Error('should not push undo stop');
		},
		executeEdits: () => {
			throw new Error('should not execute edits');
		}
	};

	await formatEditorSQL(editor);
	assert.strictEqual(edits.length, 0);
});

test('formatEditorSQL no-ops when selected text is empty', async () => {
	const editor = createMockEditor({ code: '' });
	await formatEditorSQL(editor);
	assert.strictEqual(editor.edits.length, 0);
	assert.strictEqual(editor.undoStopCount, 0);
});

test('formatEditorSQL no-ops when formatted result equals input', async () => {
	const editor = createMockEditor({ code: INVALID_SQL });
	await formatEditorSQL(editor);
	assert.strictEqual(editor.edits.length, 0);
	assert.strictEqual(editor.undoStopCount, 0);
});

test('formatEditorSQL uses fallback option when formatting fails', async () => {
	const editor = createMockEditor({ code: INVALID_SQL });
	await formatEditorSQL(editor, {
		fallback: () => 'SELECT 1'
	});
	assert.strictEqual(editor.edits.length, 1);
	assert.strictEqual(editor.edits[0].text, 'SELECT 1');
});
