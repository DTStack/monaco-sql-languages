/**
 * Pure statement-split helpers (no parser deps) for run-button gutter placement.
 */
import type { StatementRange } from './types';

/**
 * Find the first non-comment, non-whitespace character and return its 1-based line number.
 *
 * Limitation: does not treat `--` / `/*` inside string literals as text; rare for leading gutter placement.
 */
export function findFirstExecutableLine(text: string, startLineNumber: number): number {
	let index = 0;
	let lineOffset = 0;
	let inBlockComment = false;
	const length = text.length;

	while (index < length) {
		const char = text[index];
		const nextChar = text[index + 1];

		if (inBlockComment) {
			if (char === '*' && nextChar === '/') {
				index += 2;
				inBlockComment = false;
				continue;
			}
			if (char === '\n') {
				lineOffset++;
			}
			index++;
			continue;
		}

		if (char === ' ' || char === '\t' || char === '\r') {
			index++;
			continue;
		}

		if (char === '\n') {
			lineOffset++;
			index++;
			continue;
		}

		if (char === '-' && nextChar === '-') {
			while (index < length && text[index] !== '\n') {
				index++;
			}
			continue;
		}

		if (char === '/' && nextChar === '*') {
			index += 2;
			inBlockComment = true;
			continue;
		}

		return startLineNumber + lineOffset;
	}

	return startLineNumber;
}

export function buildStatementRange(
	text: string,
	startLineNumber: number,
	endLineNumber: number,
	startColumn: number,
	endColumn: number
): StatementRange {
	return {
		executableLineNumber: findFirstExecutableLine(text, startLineNumber),
		text,
		startLineNumber,
		endLineNumber,
		startColumn,
		endColumn
	};
}

function getPositionFromOffset(code: string, offset: number): { line: number; column: number } {
	const before = code.slice(0, offset);
	const lines = before.split('\n');
	return {
		line: lines.length,
		column: (lines[lines.length - 1]?.length ?? 0) + 1
	};
}

/** Semicolon split fallback when parser split is unavailable; respects quotes. */
export function splitStatementsFallback(code: string): StatementRange[] {
	const statements: StatementRange[] = [];
	let inSingleQuote = false;
	let inDoubleQuote = false;
	let lastSplit = 0;

	const pushStatement = (start: number, end: number) => {
		const text = code.slice(start, end);
		if (!text.trim()) {
			return;
		}
		const startPos = getPositionFromOffset(code, start);
		const endPos = getPositionFromOffset(code, Math.max(start, end - 1));
		statements.push(
			buildStatementRange(text, startPos.line, endPos.line, startPos.column, endPos.column)
		);
	};

	for (let i = 0; i < code.length; i++) {
		const ch = code[i];
		if (ch === "'" && !inDoubleQuote) {
			inSingleQuote = !inSingleQuote;
		} else if (ch === '"' && !inSingleQuote) {
			inDoubleQuote = !inDoubleQuote;
		} else if (ch === ';' && !inSingleQuote && !inDoubleQuote) {
			pushStatement(lastSplit, i + 1);
			lastSplit = i + 1;
		}
	}

	if (lastSplit < code.length) {
		pushStatement(lastSplit, code.length);
	}

	return statements;
}
