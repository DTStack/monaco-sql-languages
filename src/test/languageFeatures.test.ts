import * as assert from 'assert';

import { BaseSQLWorker } from '../baseSQLWorker';
import { LanguageIdEnum } from '../common/constants';
import {
	CancellationTokenSource,
	editor,
	languages,
	Position
} from '../fillers/monaco-editor-core';
import { CompletionAdapter, WorkerAccessor } from '../languageFeatures';
import { language as flinkLanguage } from '../languages/flink/flink';
import { language as genericLanguage } from '../languages/generic/generic';
import { language as hiveLanguage } from '../languages/hive/hive';
import { language as impalaLanguage } from '../languages/impala/impala';
import { language as mysqlLanguage } from '../languages/mysql/mysql';
import { language as pgsqlLanguage } from '../languages/pgsql/pgsql';
import { language as sparkLanguage } from '../languages/spark/spark';
import { language as trinoLanguage } from '../languages/trino/trino';
import { LanguageServiceDefaultsImpl, modeConfigurationDefault } from '../monaco.contribution';

const SQL_DIALECTS = [
	{ name: LanguageIdEnum.FLINK, language: flinkLanguage },
	{ name: LanguageIdEnum.HIVE, language: hiveLanguage },
	{ name: LanguageIdEnum.MYSQL, language: mysqlLanguage },
	{ name: LanguageIdEnum.PG, language: pgsqlLanguage },
	{ name: LanguageIdEnum.SPARK, language: sparkLanguage },
	{ name: LanguageIdEnum.TRINO, language: trinoLanguage },
	{ name: LanguageIdEnum.IMPALA, language: impalaLanguage },
	{ name: LanguageIdEnum.GENERIC, language: genericLanguage }
].map((dialect) => ({
	...dialect,
	languageId: `${dialect.name}-completion-test`
}));
const MYSQL_DIALECT = SQL_DIALECTS.find(({ name }) => name === LanguageIdEnum.MYSQL)!;

SQL_DIALECTS.forEach((dialect) => {
	languages.register({ id: dialect.languageId });
	languages.setMonarchTokensProvider(dialect.languageId, dialect.language);
});

interface CompletionResult {
	suggestions: languages.CompletionItem[];
	workerCallCount: number;
}

function getEndPosition(value: string): Position {
	const lines = value.split('\n');
	return new Position(lines.length, lines[lines.length - 1].length + 1);
}

async function provideCompletionItems(
	languageId: string,
	value: string,
	position: Position = getEndPosition(value)
): Promise<CompletionResult> {
	const model = editor.createModel(value, languageId);
	const cancellationTokenSource = new CancellationTokenSource();
	let workerCallCount = 0;
	const worker: WorkerAccessor<BaseSQLWorker> = async () => {
		workerCallCount++;
		return {
			doCompletionWithEntities: async () => ({
				suggestions: {
					syntax: [],
					keywords: ['SELECT']
				},
				allEntities: null,
				context: null
			})
		} as unknown as BaseSQLWorker;
	};
	const defaults = new LanguageServiceDefaultsImpl(languageId, modeConfigurationDefault);
	const adapter = new CompletionAdapter(worker, defaults);

	try {
		const completionList = await adapter.provideCompletionItems(
			model,
			position,
			{ triggerKind: languages.CompletionTriggerKind.Invoke },
			cancellationTokenSource.token
		);

		return {
			suggestions: completionList.suggestions,
			workerCallCount
		};
	} finally {
		cancellationTokenSource.dispose();
		model.dispose();
	}
}

SQL_DIALECTS.forEach((dialect) => {
	test(`does not provide ${dialect.name} completion items inside a line comment`, async () => {
		const result = await provideCompletionItems(dialect.languageId, 'SELECT 1 -- comment');

		assert.deepStrictEqual(result.suggestions, []);
		assert.strictEqual(result.workerCallCount, 0);
	});

	test(`does not provide ${dialect.name} completion items inside a multiline block comment`, async () => {
		const result = await provideCompletionItems(
			dialect.languageId,
			'SELECT /* comment\nstill comment */',
			new Position(2, 6)
		);

		assert.deepStrictEqual(result.suggestions, []);
		assert.strictEqual(result.workerCallCount, 0);
	});
});

test('does not provide completion items after a line comment marker', async () => {
	const result = await provideCompletionItems(MYSQL_DIALECT.languageId, '--');

	assert.deepStrictEqual(result.suggestions, []);
	assert.strictEqual(result.workerCallCount, 0);
});

test('does not provide completion items inside a MySQL hash comment', async () => {
	const result = await provideCompletionItems(MYSQL_DIALECT.languageId, '# comment');

	assert.deepStrictEqual(result.suggestions, []);
	assert.strictEqual(result.workerCallCount, 0);
});

test('does not provide completion items inside a block comment', async () => {
	const result = await provideCompletionItems(
		MYSQL_DIALECT.languageId,
		'/* comment */',
		new Position(1, 4)
	);

	assert.deepStrictEqual(result.suggestions, []);
	assert.strictEqual(result.workerCallCount, 0);
});

test('provides completion items after a closed block comment', async () => {
	const result = await provideCompletionItems(MYSQL_DIALECT.languageId, 'SELECT /* comment */');

	assert.deepStrictEqual(
		result.suggestions.map((item) => item.label),
		['SELECT']
	);
	assert.strictEqual(result.workerCallCount, 1);
});

test('does not treat comment markers inside strings as comments', async () => {
	const result = await provideCompletionItems(MYSQL_DIALECT.languageId, "SELECT '--'");

	assert.deepStrictEqual(
		result.suggestions.map((item) => item.label),
		['SELECT']
	);
	assert.strictEqual(result.workerCallCount, 1);
});

test('does not treat a single minus sign as a comment', async () => {
	const result = await provideCompletionItems(MYSQL_DIALECT.languageId, '-');

	assert.deepStrictEqual(
		result.suggestions.map((item) => item.label),
		['SELECT']
	);
	assert.strictEqual(result.workerCallCount, 1);
});

test('keeps the existing completion flow for regular SQL', async () => {
	const result = await provideCompletionItems(MYSQL_DIALECT.languageId, 'SELECT ');

	assert.deepStrictEqual(
		result.suggestions.map((item) => item.label),
		['SELECT']
	);
	assert.strictEqual(result.workerCallCount, 1);
});
