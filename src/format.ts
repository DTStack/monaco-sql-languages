import { LanguageIdEnum } from './common/constants';
import type { FormatSQLOptions } from './monaco.contribution';

const languageIdToSqlLanguage: Record<string, string> = {
	[LanguageIdEnum.MYSQL]: 'mysql',
	[LanguageIdEnum.PG]: 'postgresql',
	[LanguageIdEnum.SPARK]: 'spark',
	[LanguageIdEnum.HIVE]: 'hive',
	[LanguageIdEnum.TRINO]: 'trino',
	[LanguageIdEnum.FLINK]: 'sql',
	[LanguageIdEnum.IMPALA]: 'sql',
	[LanguageIdEnum.GENERIC]: 'sql'
};

type SqlFormatterModule = {
	format: (query: string, cfg?: Record<string, unknown>) => string;
};

let sqlFormatterModule: SqlFormatterModule | null | undefined;

type SqlFormatterLoader = () => Promise<SqlFormatterModule | null>;

let sqlFormatterLoaderOverride: SqlFormatterLoader | undefined;

/** @internal Resets cache and optional loader override (unit tests only). */
export function __configureSqlFormatterLoaderForTests(loader?: SqlFormatterLoader): void {
	sqlFormatterLoaderOverride = loader;
	sqlFormatterModule = undefined;
}

async function loadSqlFormatter(): Promise<SqlFormatterModule | null> {
	if (sqlFormatterLoaderOverride) {
		return sqlFormatterLoaderOverride();
	}
	if (sqlFormatterModule !== undefined) {
		return sqlFormatterModule;
	}
	try {
		// Let bundlers (webpack/vite) emit an async chunk when sql-formatter is installed.
		// Do not use webpackIgnore — bare dynamic import fails in browser without a bundler.
		const mod = (await import('sql-formatter')) as SqlFormatterModule;
		sqlFormatterModule = mod;
	} catch {
		sqlFormatterModule = null;
	}
	return sqlFormatterModule ?? null;
}

const DEFAULT_TAB_WIDTH = 4;

function resolveTabWidth(tabWidth: number | undefined): number {
	if (typeof tabWidth === 'number' && Number.isFinite(tabWidth) && tabWidth >= 1) {
		return Math.floor(tabWidth);
	}
	return DEFAULT_TAB_WIDTH;
}

/**
 * Format SQL with sql-formatter (optional peer dependency, loaded on demand).
 * Uses whichever `sql-formatter` version the consumer installed (peer dependency).
 * Priority: built-in sql-formatter → fallback → original code.
 */
export async function formatSQL(
	code: string,
	languageId: string,
	options?: FormatSQLOptions
): Promise<string> {
	if (!code) {
		return code;
	}

	const sqlFormatter = await loadSqlFormatter();
	if (sqlFormatter) {
		try {
			return sqlFormatter.format(code, {
				language: languageIdToSqlLanguage[languageId] ?? 'sql',
				tabWidth: resolveTabWidth(options?.tabWidth)
			});
		} catch {
			// fall through to fallback
		}
	}

	if (options?.fallback) {
		try {
			return await options.fallback(code, languageId);
		} catch {
			// ignore
		}
	}

	return code;
}
