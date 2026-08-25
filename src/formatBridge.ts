import type { IDisposable } from './fillers/monaco-editor-core';
import type { LanguageServiceDefaults } from './monaco.contribution';

/**
 * Hook for the optional format entry. Lives outside format.ts so the main bundle
 * never statically references sql-formatter.
 */
export type FormatActionRegistrar = (defaults: LanguageServiceDefaults) => IDisposable;

const FORMAT_ENTRY_HINT =
	'Import "monaco-sql-languages/format" once (and install optional peer sql-formatter) ' +
	'before enabling format, or before the language mode loads.';

let formatActionRegistrar: FormatActionRegistrar | undefined;
let onRegistrarReady: (() => void) | undefined;

export function setFormatActionRegistrar(registrar: FormatActionRegistrar | undefined): void {
	formatActionRegistrar = registrar;
	if (registrar) {
		onRegistrarReady?.();
	}
}

export function getFormatActionRegistrar(): FormatActionRegistrar | undefined {
	return formatActionRegistrar;
}

/**
 * Invoked when the format entry registers a registrar (e.g. to re-setup languages
 * that already loaded with format.enable while the registrar was still missing).
 * If a registrar is already present, the handler runs immediately.
 */
export function setFormatActionRegistrarReadyHandler(handler: (() => void) | undefined): void {
	onRegistrarReady = handler;
	if (handler && formatActionRegistrar) {
		handler();
	}
}

export function formatEntryMissingMessage(languageId?: string): string {
	const scope = languageId
		? `format.enable is true for "${languageId}"`
		: 'format.enable is true';
	return (
		`[monaco-sql-languages] ${scope} but monaco-sql-languages/format was not imported. ` +
		FORMAT_ENTRY_HINT
	);
}

/** Always logs (not once). Prefer this over a one-shot warn so drop_console is less likely to hide every signal. */
export function reportFormatEntryMissing(languageId?: string): void {
	console.error(formatEntryMissingMessage(languageId));
}

export function assertFormatEntryImported(languageId: string): void {
	if (getFormatActionRegistrar()) {
		return;
	}
	const message = formatEntryMissingMessage(languageId);
	console.error(message);
	throw new Error(message);
}
