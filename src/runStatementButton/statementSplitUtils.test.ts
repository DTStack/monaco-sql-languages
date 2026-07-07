import * as assert from 'assert';
import { findFirstExecutableLine, splitStatementsFallback } from './statementSplitUtils';

test('findFirstExecutableLine returns start line for plain SQL', () => {
	assert.strictEqual(findFirstExecutableLine('SELECT 1;', 1), 1);
	assert.strictEqual(findFirstExecutableLine('SELECT 1;', 5), 5);
});

test('findFirstExecutableLine skips leading blank lines', () => {
	assert.strictEqual(findFirstExecutableLine('\n\nSELECT 1;', 1), 3);
});

test('findFirstExecutableLine skips leading line comments', () => {
	const text = '-- comment\nSELECT 1;';
	assert.strictEqual(findFirstExecutableLine(text, 1), 2);
});

test('findFirstExecutableLine skips leading block comments', () => {
	const text = '/* block\ncomment */\nSELECT 1;';
	assert.strictEqual(findFirstExecutableLine(text, 1), 3);
});

test('findFirstExecutableLine skips mixed leading whitespace and comments', () => {
	const text = '\n  -- line\n/* a */ SELECT 1;';
	assert.strictEqual(findFirstExecutableLine(text, 10), 12);
});

test('findFirstExecutableLine returns startLineNumber when text is only comments', () => {
	assert.strictEqual(findFirstExecutableLine('-- only comment', 3), 3);
	assert.strictEqual(findFirstExecutableLine('/* only */', 1), 1);
});

test('splitStatementsFallback splits by semicolon', () => {
	const ranges = splitStatementsFallback('SELECT 1; SELECT 2;');
	assert.strictEqual(ranges.length, 2);
	assert.strictEqual(ranges[0].text.trim(), 'SELECT 1;');
	assert.strictEqual(ranges[1].text.trim(), 'SELECT 2;');
	assert.strictEqual(ranges[0].executableLineNumber, 1);
	assert.strictEqual(ranges[1].executableLineNumber, 1);
});

test('splitStatementsFallback keeps semicolon inside quotes', () => {
	const ranges = splitStatementsFallback('SELECT \'a;b\'; SELECT "c;d";');
	assert.strictEqual(ranges.length, 2);
	assert.ok(ranges[0].text.includes("'a;b'"));
	assert.ok(ranges[1].text.includes('"c;d"'));
});

test('splitStatementsFallback handles multiline statements and leading comments', () => {
	const code = 'SELECT\n  1;\n-- comment\nSELECT 2;';
	const ranges = splitStatementsFallback(code);
	assert.strictEqual(ranges.length, 2);
	assert.strictEqual(ranges[0].startLineNumber, 1);
	assert.strictEqual(ranges[0].executableLineNumber, 1);
	assert.strictEqual(ranges[1].executableLineNumber, 4);
	assert.ok(ranges[1].text.includes('SELECT 2;'));
});

test('splitStatementsFallback keeps lone semicolons as statements', () => {
	// Splitter still returns `;` segments; createRunStatementButton hides them by default.
	const ranges = splitStatementsFallback('SELECT 1;;;SELECT 2;');
	assert.strictEqual(ranges.length, 4);
	assert.strictEqual(ranges[0].text.trim(), 'SELECT 1;');
	assert.strictEqual(ranges[1].text, ';');
	assert.strictEqual(ranges[2].text, ';');
	assert.strictEqual(ranges[3].text.trim(), 'SELECT 2;');
});

test('splitStatementsFallback returns empty array for blank input', () => {
	assert.deepStrictEqual(splitStatementsFallback('   \n\t'), []);
	assert.deepStrictEqual(splitStatementsFallback(''), []);
});
