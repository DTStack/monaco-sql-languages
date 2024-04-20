/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../../fillers/monaco-editor-core';
import { TokenClassConsts } from '../../common/constants';

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: '--',
		blockComment: ['/*', '*/']
	},
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
	],
	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
		{ open: '`', close: '`' }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
		{ open: '`', close: '`' }
	]
};

export const language = <languages.IMonarchLanguage>{
	defaultToken: '',
	tokenPostfix: '.sql',
	ignoreCase: true,
	brackets: [
		{ open: '[', close: ']', token: TokenClassConsts.DELIMITER_SQUARE },
		{ open: '(', close: ')', token: TokenClassConsts.DELIMITER_PAREN },
		{ open: '{', close: '}', token: TokenClassConsts.DELIMITER_CURLY }
	],
	keywords: [
		'ALL',
		'ALTER',
		'AND',
		'ARRAY',
		'AS',
		'BETWEEN',
		'BIGINT',
		'BINARY',
		'BOOLEAN',
		'BY',
		'CASE',
		'CAST',
		'CHAR',
		'COLUMN',
		'CREATE',
		'CROSS',
		'CURRENT',
		'DATE',
		'DECIMAL',
		'DEFAULT',
		'DELETE',
		'DESCRIBE',
		'DISTINCT',
		'DOUBLE',
		'DROP',
		'ELSE',
		'END',
		'EXISTS',
		'EXTERNAL',
		'FALSE',
		'FLOAT',
		'FOR',
		'FROM',
		'FULL',
		'FUNCTION',
		'GRANT',
		'GROUP',
		'HAVING',
		'IN',
		'INNER',
		'INSERT',
		'INT',
		'INTEGER',
		'INTERVAL',
		'INTO',
		'IS',
		'JOIN',
		'LEFT',
		'LIKE',
		'NOT',
		'NULL',
		'OFFSET',
		'ON',
		'OR',
		'ORDER',
		'OUTER',
		'OVER',
		'PARTITION',
		'PRIMARY',
		'RANGE',
		'REAL',
		'RETURNS',
		'REVOKE',
		'RIGHT',
		'ROW',
		'ROWS',
		'SELECT',
		'SET',
		'SHOW',
		'SMALLINT',
		'TABLE',
		'TABLESAMPLE',
		'THEN',
		'TIMESTAMP',
		'TO',
		'TRUE',
		'TRUNCATE',
		'UNION',
		'UNKNOWN',
		'UPDATE',
		'USING',
		'VALUES',
		'VARCHAR',
		'WHEN',
		'WHERE',
		'WITH',
		// part of non-reserved keywords which is common
		'ADD',
		'AGGREGATE',
		'ASC',
		'COMMENT',
		'COMPUTE',
		'DATABASE',
		'DESC',
		'EXPLAIN',
		'IF',
		'ILIKE',
		'INCREMENTAL',
		'INDEX',
		'IREGEXP',
		'KEY',
		'KUDU',
		'LIMIT',
		'LOAD',
		'LOCATION',
		'OVERWRITE',
		'PARTITIONED',
		'PARTITIONS',
		'POSITION',
		'POWER',
		'PURGE',
		'RECOVER',
		'REFRESH',
		'REGEXP',
		'RENAME',
		'REPLACE',
		'RLIKE',
		'ROLE',
		'SCHEMA',
		'SHUTDOWN',
		'SORT',
		'STORED',
		'UPPER',
		'UPSERT',
		'USE',
		'VALUE',
		'VIEW'
	],
	operators: [
		// https://impala.apache.org/docs/build/html/topics/impala_operators.html
		'DIV',
		'BETWEEN',
		'EXISTS',
		'LIKE',
		'ILIKE',
		'NOT',
		'IN',
		'IREGEXP',
		'IS',
		'REGEXP',
		'RLIKE',
		'AND',
		'OR'
	],
	builtinFunctions: [
		// https://impala.apache.org/docs/build/html/topics/impala_functions.html
		// Mathematical Functions
		'ABS',
		'ACOS',
		'ASIN',
		'ATAN',
		'ATAN2',
		'BIN',
		'CEIL',
		'CEILING',
		'DCEIL',
		'CONV',
		'coS',
		'COSH',
		'COT',
		'DEGREES',
		'E',
		'EXP',
		'FACTORIAL',
		'FLOOR',
		'DFLOOR',
		'FMOD',
		'FNV_HASH',
		'GREATEST',
		'HEX',
		'IS_INF',
		'IS_NAN',
		'LEAST',
		'LN',
		'LOG',
		'LOG10',
		'LOG2',
		'MAX_INT',
		'MAX_TINYINT',
		'MAX_SMALLINT',
		'MAX_BIGINT',
		'MIN_INT',
		'MIN_TINYINT',
		'MIN_SMALLINT',
		'MIN_BIGINT',
		'MOD',
		'MURMUR_HASH',
		'NEGATIVE',
		'PI',
		'PMOD',
		'POSITIVE',
		'POW',
		'POWER',
		'DPOW',
		'FPOW',
		'PRECISION',
		'QUOTIENT',
		'RADIANS',
		'RAND',
		'RANDOM',
		'ROUND',
		'DROUND',
		'SCALE',
		'SIGN',
		'SIN',
		'SINH',
		'SQRT',
		'TAN',
		'TANH',
		'TRUNCATE',
		'DTRUNC',
		'TRUNC',
		'UNHEX',
		'WIDTH_BUCKET',
		// Type Conversion Functions
		'CAST',
		'TYPEOF',
		// Date and Time Functions
		'ADD_MONTHS',
		'ADDDATE',
		'CURRENT_DATE',
		'CURRENT_TIMESTAMP',
		'DATE_ADD',
		'DATE_PART',
		'DATE_SUB',
		'DATE_TRUNC',
		'DATEDIFF',
		'DAY',
		'DAYNAME',
		'DAYOFWEEK',
		'DAYOFYEAR',
		'DAYS_ADD',
		'DAYS_SUB',
		'EXTRACT',
		'FROM_TIMESTAMP',
		'FROM_UNIXTIME',
		'FROM_UTC_TIMESTAMP',
		'HOUR',
		'HOURS_ADD',
		'HOURS_SUB',
		'INT_MONTHS_BETWEEN',
		'MICROSECONDS_ADD',
		'MICROSECONDS_SUB',
		'MILLISECOND',
		'MILLISECONDS_ADD',
		'MILLISECONDS_SUB',
		'MINUTE',
		'MINUTES_ADD',
		'MINUTES_SUB',
		'MONTH',
		'MONTHNAME',
		'MONTHS ADD',
		'MONTHS_BETWEEN',
		'MONTHS_SUB',
		'NANOSECONDS_ADD',
		'NANOSECONDS_SUB',
		'NEXT_DAY',
		'NOW',
		'QUARTER',
		'SECOND',
		'SECONDS_ADD',
		'SECONDS_SUB',
		'SUBDATE',
		'TIMEOFDAY',
		'TIMESTAMP_CMP',
		'TO_DATE',
		'TO_TIMESTAMP',
		'TO_UTC_TIMESTAMP',
		'TRUNC',
		'UNIX_TIMESTAMP',
		'UTC_TIMESTAMP',
		'WEEKOFYEAR',
		'WEEKS_ADD',
		'WEEKS_SUB',
		'YEAR',
		'YEARS_ADD',
		'YEARS_SUB',
		// Conditional Functions
		'CASE',
		'CASE2',
		'COALESCE',
		'DECODE',
		'F',
		'IFNULL',
		'ISFALSE',
		'ISNOTFALSE',
		'ISNOTTRUE',
		'ISNULL',
		'ISTRUE',
		'NONNULLVALUE',
		'NULLIF',
		'NULLIFZERO',
		'NULLVALUE',
		'NVL',
		'NVL2',
		'ZEROIFNULL',
		// String Functions
		'ASCII',
		'BASE64DECODE',
		'BASE64ENCODE',
		'BTRIM',
		'BYTES',
		'CHAR_LENGTH',
		'CHR',
		'CONCAT',
		'CONCAT_WS',
		'FIND_IN_SET',
		'GROUP_CONCAT',
		'INITCAP',
		'INSTR',
		'JARO_DISTANCE',
		'JARO_DIST',
		'JARO_SIMILARITY',
		'JARO_SIM',
		'JARO_WINKER_DISTANCE',
		'JW_DST',
		'JARO_WINKER_SIMILARITY',
		'JW_SIM',
		'LEFT',
		'LENGTH',
		'LEVENSHTEIN',
		'LE_DST',
		'LOCATE',
		'LOWER',
		'LCASE',
		'LPAD',
		'LTRI',
		'PARSE_URL',
		'REGEXP_ESCAPE',
		'REGEXP_EXTRACT',
		'REGEXP_LIKE',
		'REGEXP_REPLACE',
		'REPEAT',
		'REPLACE',
		'REVERSE',
		'RIGHT',
		'RPAD',
		'RTRIM',
		'SPACE',
		'SPLIT_PART',
		'STRLEFT',
		'STRRIGHT',
		'SUBSTR',
		'SUBSTRING',
		'TRANSLATE',
		'TRIM',
		'UPPER',
		'UCASE',
		// Aggregate Functions
		'APPX_MEDIAN',
		'AVG',
		'COUNT',
		'GROUP_CONCAT',
		'MAX',
		'MIN',
		'NDV',
		'STDDEV',
		'STDDEV_SAMP',
		'STDDEV_POP',
		'SUM',
		'VARIANCE',
		'VARIANCE_SAMP',
		'VARIANCE_POP',
		'VAR_SAMP',
		'VAR_POP',
		// Bit Functions
		'BITAND',
		'BITNOT',
		'BITOR',
		'BITXOR',
		'COUNTSET',
		'GETBIT',
		'ROTATELEFT',
		'ROTATERIGHT',
		'SETBIT',
		'SHIFTLEFT',
		'SHIFTRIGHT',
		// Miscellaneous Functions
		'CURRENT_DATABASE',
		'EFFECTIVE_USER',
		'GET_JSON_OBJECT',
		'LOGGED_IN_USER',
		'PID',
		'SLEEP',
		'USER',
		'UUIb',
		'VERSION',
		'COORDINATOR'
	],
	builtinVariables: [
		// Not support
	],
	typeKeywords: [
		// https://impala.apache.org/docs/build/html/topics/impala_datatypes.html
		'ARRAY',
		'BIGINT',
		'BOOLEAN',
		'CHAR',
		'DATE',
		'DECIMAL',
		'DOUBLE',
		'FLOAT',
		'INT',
		'MAP',
		'REAL',
		'SMALLINT',
		'STRING',
		'STRUCT',
		'TIMESTAMP',
		'TINYINT',
		'VARCHAR',
		'Complex'
	],
	scopeKeywords: ['CASE', 'END', 'WHEN', 'THEN', 'ELSE'],
	pseudoColumns: [
		// Not support
	],
	tokenizer: {
		root: [
			{ include: '@comments' },
			{ include: '@whitespace' },
			{ include: '@pseudoColumns' },
			{ include: '@customParams' },
			{ include: '@numbers' },
			{ include: '@strings' },
			{ include: '@complexIdentifiers' },
			{ include: '@scopes' },
			{ include: '@complexDataTypes' },
			{ include: '@complexOperators' },
			[/[;,.]/, TokenClassConsts.DELIMITER],
			[/[\(\)\[\]\{\}]/, '@brackets'],
			[
				/[\w@#$]+/,
				{
					cases: {
						'@scopeKeywords': TokenClassConsts.KEYWORD_SCOPE,
						'@operators': TokenClassConsts.OPERATOR_KEYWORD,
						'@typeKeywords': TokenClassConsts.TYPE,
						'@builtinVariables': TokenClassConsts.VARIABLE,
						'@builtinFunctions': TokenClassConsts.PREDEFINED,
						'@keywords': TokenClassConsts.KEYWORD,
						'@default': TokenClassConsts.IDENTIFIER
					}
				}
			],
			[/[<>=!%&+\-*/|~^]/, TokenClassConsts.OPERATOR_SYMBOL]
		],
		whitespace: [[/[\s\t\r\n]+/, TokenClassConsts.WHITE]],
		comments: [
			[/--+.*/, TokenClassConsts.COMMENT],
			[/\/\*/, { token: TokenClassConsts.COMMENT_QUOTE, next: '@comment' }]
		],
		comment: [
			[/[^*/]+/, TokenClassConsts.COMMENT],
			[/\*\//, { token: TokenClassConsts.COMMENT_QUOTE, next: '@pop' }],
			[/./, TokenClassConsts.COMMENT]
		],
		pseudoColumns: [],
		customParams: [
			[/\${[A-Za-z0-9._-]*}/, TokenClassConsts.VARIABLE],
			[/\@\@{[A-Za-z0-9._-]*}/, TokenClassConsts.VARIABLE]
		],
		numbers: [
			[/0[xX][0-9a-fA-F]*/, TokenClassConsts.NUMBER_HEX],
			[/[$][+-]*\d*(\.\d*)?/, TokenClassConsts.NUMBER],
			[/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, TokenClassConsts.NUMBER]
		],
		strings: [
			[/'/, { token: TokenClassConsts.STRING, next: '@string' }],
			[/"/, { token: TokenClassConsts.STRING, next: '@string_double' }]
		],
		string: [
			[/[^']+/, TokenClassConsts.STRING_ESCAPE],
			[/''/, TokenClassConsts.STRING],
			[/'/, { token: TokenClassConsts.STRING, next: '@pop' }]
		],
		string_double: [
			[/[^"]+/, TokenClassConsts.STRING_ESCAPE],
			[/""/, TokenClassConsts.STRING],
			[/"/, { token: TokenClassConsts.STRING, next: '@pop' }]
		],
		complexIdentifiers: [
			[/`/, { token: TokenClassConsts.IDENTIFIER_QUOTE, next: '@quotedIdentifier' }]
		],
		quotedIdentifier: [
			[/[^`]+/, TokenClassConsts.IDENTIFIER_QUOTE],
			[/``/, TokenClassConsts.IDENTIFIER_QUOTE],
			[/`/, { token: TokenClassConsts.IDENTIFIER_QUOTE, next: '@pop' }]
		],
		scopes: [],
		complexDataTypes: [],
		complexOperators: [
			[
				/IS\s+(NOT\s+)?(TRUE|FALSE|NULL|UNKNOWN|DISTINCT FROM)\b/i,
				{ token: TokenClassConsts.OPERATOR_KEYWORD }
			],
			[/NOT\s+(EXISTS|ILIKE|IN|LIKE)\b/i, { token: TokenClassConsts.OPERATOR_KEYWORD }]
		]
	}
};
