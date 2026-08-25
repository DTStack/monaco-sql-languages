import * as assert from 'assert';

import {
	assertFormatEntryImported,
	formatEntryMissingMessage,
	getFormatActionRegistrar,
	setFormatActionRegistrar,
	setFormatActionRegistrarReadyHandler
} from './formatBridge';

test('formatEntryMissingMessage includes languageId when provided', () => {
	const msg = formatEntryMissingMessage('mysql');
	assert.ok(msg.includes('mysql'));
	assert.ok(msg.includes('monaco-sql-languages/format'));
});

test('assertFormatEntryImported throws when registrar is missing', () => {
	setFormatActionRegistrar(undefined);
	assert.throws(() => assertFormatEntryImported('mysql'), /monaco-sql-languages\/format/);
});

test('assertFormatEntryImported passes when registrar is set', () => {
	setFormatActionRegistrar(() => ({ dispose() {} }));
	assertFormatEntryImported('mysql');
	setFormatActionRegistrar(undefined);
});

test('setFormatActionRegistrar invokes ready handler', () => {
	let called = 0;
	setFormatActionRegistrar(undefined);
	setFormatActionRegistrarReadyHandler(() => {
		called += 1;
	});
	setFormatActionRegistrar(() => ({ dispose() {} }));
	assert.strictEqual(called, 1);
	assert.ok(getFormatActionRegistrar());
	setFormatActionRegistrarReadyHandler(undefined);
	setFormatActionRegistrar(undefined);
});

test('setFormatActionRegistrarReadyHandler runs immediately if registrar already set', () => {
	let called = 0;
	setFormatActionRegistrar(() => ({ dispose() {} }));
	setFormatActionRegistrarReadyHandler(() => {
		called += 1;
	});
	assert.strictEqual(called, 1);
	setFormatActionRegistrarReadyHandler(undefined);
	setFormatActionRegistrar(undefined);
});
