import { registerFormatAction } from './formatEditor';
import { setFormatActionRegistrar } from './formatBridge';

/**
 * Optional format API entry (`monaco-sql-languages/format`).
 * Importing this module pulls in sql-formatter and registers the built-in Format action
 * used when `format.enable` is true.
 */
setFormatActionRegistrar(registerFormatAction);

export { formatSQL } from './format';
export { registerFormatAction };
export { formatEditorSQL, type FormatTargetEditor, type TextRange } from './formatEditor';
export type { FormatFallback } from './formatTypes';
export type { FormatSQLOptions } from './monaco.contribution';
