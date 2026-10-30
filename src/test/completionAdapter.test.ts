import * as assert from 'assert';
import { editor, languages, Position } from '../fillers/monaco-editor-core';
import { CompletionAdapter } from '../languageFeatures';
import {
	CompletionOptions,
	LanguageServiceDefaultsImpl,
	modeConfigurationDefault
} from '../monaco.contribution';

const mockWorkerResult = {
	suggestions: {
		keywords: ['SELECT'],
		syntax: []
	},
	allEntities: [],
	context: {
		isStatementBeginning: false
	}
};

function createWorkerAccessor() {
	return () =>
		Promise.resolve({
			doCompletionWithEntities: () => Promise.resolve(mockWorkerResult)
		} as any);
}

function createDefaults(completionItems: Partial<CompletionOptions>) {
	return new LanguageServiceDefaultsImpl('mysql', {
		...modeConfigurationDefault,
		completionItems: {
			...modeConfigurationDefault.completionItems,
			...completionItems
		}
	});
}

suite('CompletionAdapter - continuousCompletion', () => {
	const model = editor.createModel('sel', 'mysql');
	const position = new Position(1, 4);

	test('no command is attached and no trailing space by default', async () => {
		const adapter = new CompletionAdapter(createWorkerAccessor(), createDefaults({}));
		const result = await adapter.provideCompletionItems(model, position, {} as any, {} as any);
		assert.strictEqual(result.suggestions.length, 1);
		assert.strictEqual(result.suggestions[0].command, undefined);
		assert.strictEqual(result.suggestions[0].insertText, 'SELECT');
	});

	test('keyword items get a trailing space and triggerSuggest command when enabled', async () => {
		const adapter = new CompletionAdapter(
			createWorkerAccessor(),
			createDefaults({ continuousCompletion: true })
		);
		const result = await adapter.provideCompletionItems(model, position, {} as any, {} as any);
		assert.strictEqual(result.suggestions.length, 1);
		assert.strictEqual(result.suggestions[0].insertText, 'SELECT ');
		assert.strictEqual(result.suggestions[0].command?.id, 'editor.action.triggerSuggest');
	});

	test('keyword items still re-trigger when triggerCharacters are customized', async () => {
		const adapter = new CompletionAdapter(
			createWorkerAccessor(),
			createDefaults({ continuousCompletion: true, triggerCharacters: ['.'] })
		);
		const result = await adapter.provideCompletionItems(model, position, {} as any, {} as any);
		assert.strictEqual(result.suggestions[0].insertText, 'SELECT ');
		assert.strictEqual(result.suggestions[0].command?.id, 'editor.action.triggerSuggest');
	});

	test('custom command and insertText from completionService are respected', async () => {
		const completionService = async () => [
			{
				label: 'my_db',
				kind: languages.CompletionItemKind.Field,
				insertText: 'my_db.',
				command: { id: 'my.customCommand', title: 'custom' }
			}
		];
		const adapter = new CompletionAdapter(
			createWorkerAccessor(),
			createDefaults({ completionService, continuousCompletion: true })
		);
		const result = await adapter.provideCompletionItems(model, position, {} as any, {} as any);
		assert.strictEqual(result.suggestions[0].insertText, 'my_db.');
		assert.strictEqual(result.suggestions[0].command?.id, 'my.customCommand');
	});

	test('entity items do NOT get triggerSuggest even when continuousCompletion is enabled', async () => {
		const completionService = async () => [
			{
				label: 'my_schema',
				kind: languages.CompletionItemKind.Field,
				detail: 'Remote: schema'
			}
		];
		const adapter = new CompletionAdapter(
			createWorkerAccessor(),
			createDefaults({ completionService, continuousCompletion: true })
		);
		const result = await adapter.provideCompletionItems(model, position, {} as any, {} as any);
		assert.strictEqual(result.suggestions[0].insertText, 'my_schema');
		assert.strictEqual(result.suggestions[0].command, undefined);
	});

	test('items whose insertText ends with a trigger character re-trigger suggest', async () => {
		const completionService = async () => [
			{
				label: 'my_db',
				kind: languages.CompletionItemKind.Field,
				detail: 'Remote: database',
				insertText: 'my_db.'
			}
		];
		const adapter = new CompletionAdapter(
			createWorkerAccessor(),
			createDefaults({ completionService, continuousCompletion: true })
		);
		const result = await adapter.provideCompletionItems(model, position, {} as any, {} as any);
		assert.strictEqual(result.suggestions[0].insertText, 'my_db.');
		assert.strictEqual(result.suggestions[0].command?.id, 'editor.action.triggerSuggest');
	});

	test('keyword items with an explicit plain insertText do NOT re-trigger', async () => {
		const completionService = async () => [
			{
				label: 'SELECT',
				kind: languages.CompletionItemKind.Keyword,
				insertText: 'SELECT'
			}
		];
		const adapter = new CompletionAdapter(
			createWorkerAccessor(),
			createDefaults({ completionService, continuousCompletion: true })
		);
		const result = await adapter.provideCompletionItems(model, position, {} as any, {} as any);
		assert.strictEqual(result.suggestions[0].insertText, 'SELECT');
		assert.strictEqual(result.suggestions[0].command, undefined);
	});

	suite('function keywords', () => {
		function createFunctionWorkerAccessor(keywords: string[], hasFunctionContext: boolean) {
			return () =>
				Promise.resolve({
					doCompletionWithEntities: () =>
						Promise.resolve({
							suggestions: {
								keywords,
								syntax: hasFunctionContext
									? [{ syntaxContextType: 'function', wordRanges: [] }]
									: []
							},
							allEntities: [],
							context: { isStatementBeginning: false }
						})
				} as any);
		}

		test('fall back to trailing space without a function context', async () => {
			const adapter = new CompletionAdapter(
				createFunctionWorkerAccessor(['SUM'], false),
				createDefaults({ continuousCompletion: true })
			);
			const result = await adapter.provideCompletionItems(
				model,
				position,
				{} as any,
				{} as any
			);
			assert.strictEqual(result.suggestions[0].insertText, 'SUM ');
			assert.strictEqual(result.suggestions[0].kind, languages.CompletionItemKind.Keyword);
		});

		test('ambiguous words like LEFT stay plain keywords without a function context', async () => {
			const adapter = new CompletionAdapter(
				createFunctionWorkerAccessor(['LEFT'], false),
				createDefaults({ continuousCompletion: true })
			);
			const result = await adapter.provideCompletionItems(
				model,
				position,
				{} as any,
				{} as any
			);
			assert.strictEqual(result.suggestions[0].insertText, 'LEFT ');
			assert.strictEqual(result.suggestions[0].kind, languages.CompletionItemKind.Keyword);
		});

		test('ambiguous words like LEFT are inserted as-is in a function context', async () => {
			const adapter = new CompletionAdapter(
				createFunctionWorkerAccessor(['LEFT'], true),
				createDefaults({ continuousCompletion: true })
			);
			const result = await adapter.provideCompletionItems(
				model,
				position,
				{} as any,
				{} as any
			);
			assert.strictEqual(result.suggestions[0].insertText, 'LEFT');
			assert.strictEqual(result.suggestions[0].command, undefined);
		});

		test('non-function keywords like CASE are also inserted as-is in a function context', async () => {
			const adapter = new CompletionAdapter(
				createFunctionWorkerAccessor(['CASE'], true),
				createDefaults({ continuousCompletion: true })
			);
			const result = await adapter.provideCompletionItems(
				model,
				position,
				{} as any,
				{} as any
			);
			assert.strictEqual(result.suggestions[0].insertText, 'CASE');
			assert.strictEqual(result.suggestions[0].kind, languages.CompletionItemKind.Keyword);
			assert.strictEqual(result.suggestions[0].command, undefined);
		});
	});
});
