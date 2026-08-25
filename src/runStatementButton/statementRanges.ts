/**
 * Statement splitting for run-button gutter icons.
 *
 * Strategy:
 * 1. Prefer dt-sql-parser `splitSQLByStatement` when languageId is known.
 * 2. Fall back to semicolon split (respecting quotes).
 * 3. Set `executableLineNumber` by skipping leading blank lines, line comments and block comments.
 */
import {
	FlinkSQL,
	GenericSQL,
	HiveSQL,
	ImpalaSQL,
	MySQL,
	PostgreSQL,
	SparkSQL,
	TrinoSQL
} from 'dt-sql-parser';
import type { TextSlice } from 'dt-sql-parser';
import { BasicSQL } from 'dt-sql-parser/dist/parser/common/basicSQL';

import { LanguageIdEnum } from '../common/constants';
import type { PreprocessCode } from '../monaco.contribution';
import {
	buildStatementRange,
	findFirstExecutableLine,
	splitStatementsFallback
} from './statementSplitUtils';
import type { StatementRange } from './types';

export { findFirstExecutableLine, splitStatementsFallback } from './statementSplitUtils';

const parserMap: Record<string, () => BasicSQL> = {
	[LanguageIdEnum.FLINK]: () => new FlinkSQL(),
	[LanguageIdEnum.HIVE]: () => new HiveSQL(),
	[LanguageIdEnum.MYSQL]: () => new MySQL(),
	[LanguageIdEnum.PG]: () => new PostgreSQL(),
	[LanguageIdEnum.SPARK]: () => new SparkSQL(),
	[LanguageIdEnum.TRINO]: () => new TrinoSQL(),
	[LanguageIdEnum.IMPALA]: () => new ImpalaSQL(),
	[LanguageIdEnum.GENERIC]: () => new GenericSQL()
};

const parserCache = new Map<string, BasicSQL>();

function getOrCreateParser(languageId: string): BasicSQL | null {
	const cached = parserCache.get(languageId);
	if (cached) {
		return cached;
	}
	const factory = parserMap[languageId];
	if (!factory) {
		return null;
	}
	const parser = factory();
	parserCache.set(languageId, parser);
	return parser;
}

/** Ensure `executableLineNumber` skips leading comments even for custom statement resolvers. */
export function normalizeStatementRange(range: StatementRange): StatementRange {
	const executableLineNumber = findFirstExecutableLine(range.text, range.startLineNumber);
	if (executableLineNumber === range.executableLineNumber) {
		return range;
	}
	return {
		...range,
		executableLineNumber
	};
}

export function normalizeStatementRanges(ranges: StatementRange[]): StatementRange[] {
	return ranges.map(normalizeStatementRange);
}

function textSliceToStatementRange(slice: TextSlice): StatementRange {
	return buildStatementRange(
		slice.text,
		slice.startLine,
		slice.endLine,
		slice.startColumn,
		slice.endColumn
	);
}

function splitStatementsByParser(source: string, languageId: string): StatementRange[] | null {
	const parser = getOrCreateParser(languageId);
	if (!parser) {
		return null;
	}

	const slices = parser.splitSQLByStatement(source);
	if (!slices?.length) {
		return null;
	}

	return slices.map(textSliceToStatementRange).filter((item) => item.text.trim());
}

export function getStatementRangesByLanguage(
	code: string,
	languageId?: string,
	preprocessCode?: PreprocessCode | null
): StatementRange[] {
	const source = typeof preprocessCode === 'function' ? preprocessCode(code) : code;
	if (!source.trim()) {
		return [];
	}

	if (languageId) {
		try {
			const parsedStatements = splitStatementsByParser(source, languageId);
			if (parsedStatements?.length) {
				return parsedStatements;
			}
		} catch (error) {
			console.error(
				'[monaco-sql-languages] Failed to split SQL statements by parser, fallback to semicolon split:',
				error
			);
		}
	}

	return splitStatementsFallback(source);
}
