/**
 * Fallback formatter when sql-formatter is unavailable or throws.
 * Kept in a types-only module so the main package entry does not import sql-formatter.
 */
export type FormatFallback = (code: string, languageId: string) => string | Promise<string>;
