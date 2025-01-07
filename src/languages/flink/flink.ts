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
	],
	folding: {
		markers: {
			start: /((EXECUTE\s+)?BEGIN\s+STATEMENT\s+SET\b)|((EXECUTE\s+)?STATEMENT\s+SET\s+BEGIN\b)/i,
			end: /END\b/i
		}
	}
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
		'ABS',
		'ADA',
		'ADD',
		'ALL',
		'ALTER',
		'AND',
		'ANY',
		'ARRAY',
		'AS',
		'ASC',
		'BEFORE',
		'BEGIN',
		'BETWEEN',
		'BINARY',
		'BOOLEAN',
		'BY',
		'CALL',
		'CALLED',
		'CASCADE',
		'CASE',
		'CAST',
		'CATALOG',
		'CHAR',
		'COLUMN',
		'COMMENT',
		'CONSTRAINT',
		'CONSTRAINTS',
		'CREATE',
		'CROSS',
		'CUBE',
		'CURRENT',
		'CURRENT_DATE',
		'CURRENT_TIME',
		'CURRENT_TIMESTAMP',
		'DATABASE',
		'DATE',
		'DAY',
		'DEC',
		'DECIMAL',
		'DEFINE',
		'DELETE',
		'DESC',
		'DESCRIBE',
		'DISTINCT',
		'DOUBLE',
		'DROP',
		'ELSE',
		'END',
		'EQUALS',
		'ESCAPE',
		'EVERY',
		'EXCEPT',
		'EXISTS',
		'EXPLAIN',
		'FALSE',
		'FLOAT',
		'FROM',
		'FULL',
		'FUNCTION',
		'GET',
		'GRANT',
		'GRANTED',
		'GROUP',
		'GROUPING',
		'HAVING',
		'HOUR',
		'IF',
		'IMPORT',
		'IN',
		'INCLUDING',
		'INCREMENT',
		'INOUT',
		'INPUT',
		'INSERT',
		'INT',
		'INTEGER',
		'INTERSECT',
		'INTERVAL',
		'INTO',
		'INVOKER',
		'IS',
		'JAVA',
		'JOIN',
		'KEY',
		'LANGUAGE',
		'LAST',
		'LATERAL',
		'LEFT',
		'LIKE',
		'LIMIT',
		'LOAD',
		'LOCAL',
		'MAP',
		'MATCH',
		'MATCHED',
		'MAX',
		'MAXVALUE',
		'MEMBER',
		'MIN',
		'MINUTE',
		'MODULE',
		'MODULES',
		'MONTH',
		'MORE',
		'MULTISET',
		'NATURAL',
		'NEXT',
		'NONE',
		'NOT',
		'NULL',
		'NULLABLE',
		'NULLS',
		'OF',
		'OFFSET',
		'ON',
		'OPEN',
		'OPTIONS',
		'OR',
		'ORDER',
		'OUTER',
		'OVER',
		'PARAMETER',
		'PARTITION',
		'PATH',
		'PATTERN',
		'PERCENT_RANK',
		'PLAN',
		'POSITION',
		'POWER',
		'PRECEDING',
		'PREPARE',
		'PRIMARY',
		'QUARTER',
		'RANGE',
		'RANK',
		'RAW',
		'REMOVE',
		'RENAME',
		'RESET',
		'RESTRICT',
		'RIGHT',
		'ROLLUP',
		'ROW',
		'ROWS',
		'SCHEMA',
		'SECOND',
		'SELECT',
		'SESSION',
		'SET',
		'SETS',
		'SHOW',
		'SIMILAR',
		'SIMPLE',
		'SMALLINT',
		'STATEMENT',
		'STREAM',
		'STRING',
		'STYLE',
		'SUBSTRING',
		'SUM',
		'SYMMETRIC',
		'SYSTEM',
		'SYSTEM_USER',
		'TABLE',
		'THEN',
		'TIME',
		'TIMESTAMP',
		'TINYINT',
		'TO',
		'TRIM',
		'TRUE',
		'TYPE',
		'UNION',
		'UNIQUE',
		'UNKNOWN',
		'UNLOAD',
		'UNNEST',
		'USE',
		'USAGE',
		'USING',
		'VALUE',
		'VALUES',
		'VARBINARY',
		'VARCHAR',
		'VIEW',
		'WEEK',
		'WHEN',
		'WHENEVER',
		'WHERE',
		'WINDOW',
		'WITH',
		'WITHIN',
		'WITHOUT',
		'YEAR'
	],
	operators: [
		// Set
		'EXCEPT',
		'INTERSECT',
		'UNION',
		// Logical
		'AND',
		'OR',
		'NOT',
		// Arithmetic
		'DIV',
		// Join
		'LEFT',
		'RIGHT',
		'FULL',
		'INNER',
		'CROSS',
		'OUTER',
		'JOIN',
		'NATURAL',
		// Predicates
		'EXISTS',
		'IS',
		'ALL',
		'DISTINCT',
		'ANY',
		'BETWEEN',
		'IN',
		'LIKE',
		'RLIKE',
		'SIMILAR',
		'TO',
		'ESCAPE'
	],
	builtinFunctions: [
		// https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/dev/table/functions/systemfunctions/
		// Arithmetic Functions
		'POWER',
		'ABS',
		'SORT',
		'LN',
		'LOG10',
		'LOG2',
		'LOG',
		'EXP',
		'CEIL',
		'CEILING',
		'SIN',
		'SINH',
		'SQRT',
		'COS',
		'MOD',
		'TAN',
		'TANH',
		'COT',
		'ASIN',
		'ACOS',
		'ATAN',
		'ATAN2',
		'COSH',
		'DEGREES',
		'RADIANS',
		'SIGN',
		'ROUND',
		'PI',
		'E',
		'RAND',
		'RAND_INTEGER',
		'UUID',
		'BIN',
		'HEX',
		'TRUNCATE',
		// String Functions
		'CHAR_LENGTH',
		'CHARACTER_LENGTH',
		'UPPER',
		'LOWER',
		'POSITION',
		'TRIM',
		'LTRIM',
		'RTRIM',
		'REPEAT',
		'REGEXP_REPLACE',
		'OVERLAY',
		'SUBSTRING',
		'REPLACE',
		'REGEXP_EXTRACT',
		'INITCAP',
		'CONCAT',
		'CONCAT_WS',
		'LPAD',
		'RIGHT',
		'RPAD',
		'FROM_BASE64',
		'TO_BASE64',
		'ASCII',
		'CHR',
		'DECODE',
		'ENCODE',
		'INSTR',
		'LEFT',
		'LOCATE',
		'PARSE_URL',
		'REGEXP',
		'REVERSE',
		'SPLIT_INDEX',
		'STR_TO_MAP',
		'SUBSTR',
		// Temporal Functions
		'NOW',
		'CURRENT_ROW_TIMESTAMP',
		'EXTRACT',
		'YEAR',
		'QUARTER',
		'MONTH',
		'WEEK',
		'DAYOFYEAR',
		'DAYOFMONTH',
		'DAYOFWEEK',
		'HOUR',
		'MINUTE',
		'SECOND',
		'FLOOR',
		'DATE_FORMAT',
		'TIMESTAMPADD',
		'TIMESTAMPDIFF',
		'CONVERT_TZ',
		'FROM_UNIXTIME',
		'UNIX_TIMESTAMP',
		'TO_DATE',
		'TO_TIMESTAMP_LTZ',
		'TO_TIMESTAMP',
		'CURRENT_WATERMARK',
		'OVERLAPS',
		// Conditional Functions
		'COALESCE',
		'GREATEST',
		'IF',
		'IFNULL',
		'IS_ALPHA',
		'IS_DECIMAL',
		'IS_DIGIT',
		'LEAST',
		'NULLIF',
		// Type Conversion Functions
		'CAST',
		'TRY_CAST',
		'TYPEOF',
		// Collection Functions
		'CARDINALITY',
		'ELEMENT',
		'ARRAY',
		'MAP',
		'ARRAY_CONTAINS',
		// comparison function
		'EXISTS',
		'IN',
		// JSON Functions
		'JSON_EXISTS',
		'JSON_STRING',
		'JSON_VALUE',
		'JSON_QUERY',
		'JSON_OBJECT',
		'JSON_OBJECTAGG',
		'JSON_ARRAY',
		'JSON_ARRAYAGG',
		// Grouping Functions
		'GROUP_ID',
		'GROUPING',
		'GROUPING_ID',
		// Hash Functions
		'MD5',
		'SHA1',
		'SHA2',
		'SHA224',
		'SHA256',
		'SHA384',
		'SHA512',
		// Aggregate Functions
		'COUNT',
		'AVG',
		'SUM',
		'MAX',
		'MIN',
		'STDDEV_POP',
		'STDDEV_SAMP',
		'VAR_POP',
		'VAR_SAMP',
		'COLLECT',
		'VARIANCE',
		'RANK',
		'DENSE_RANK',
		'ROW_NUMBER',
		'LEAD',
		'LAG',
		'FIRST_VALUE',
		'LAST_VALUE',
		'LISTAGG',
		'CUME_DIST',
		'PERCENT_RANK',
		'NTILE'
	],
	builtinVariables: [
		// Not support
	],
	typeKeywords: [
		// https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/dev/table/types/#list-of-data-types
		'CHAR',
		'VARCHAR',
		'STRING',
		'BOOLEAN',
		'BINARY',
		'VARBINARY',
		'BYTES',
		'DECIMAL',
		'TINYINT',
		'SMALLINT',
		'INTEGER',
		'BIGINT',
		'FLOAT',
		'DOUBLE',
		'DATE',
		'TIME',
		'TIMESTAMP',
		'TIMESTAMP_LTZ',
		'ARRAY',
		'MULTISET',
		'MAP',
		'ROW',
		'RAW',
		'DEC',
		'NUMERIC',
		'INT',
		'INTERVAL'
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
			{ include: '@complexFunctions' },
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
			// [/\/\*/, { token: 'comment.quote', next: '@push' }],    // nested comment not allowed :-(
			[/\*\//, { token: TokenClassConsts.COMMENT_QUOTE, next: '@pop' }],
			[/./, TokenClassConsts.COMMENT]
		],
		pseudoColumns: [
			[
				/[$][A-Za-z_][\w@#$]*/,
				{
					cases: {
						'@pseudoColumns': TokenClassConsts.PREDEFINED,
						'@default': TokenClassConsts.IDENTIFIER
					}
				}
			]
		],
		customParams: [
			[/\${[A-Za-z0-9._-]*}/, TokenClassConsts.VARIABLE],
			[/\@\@{[A-Za-z0-9._-]*}/, TokenClassConsts.VARIABLE]
		],
		numbers: [
			[/0[xX][0-9a-fA-F]*/, TokenClassConsts.NUMBER_HEX],
			[/[$][+-]*\d*(\.\d*)?/, TokenClassConsts.NUMBER],
			[/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, TokenClassConsts.NUMBER]
		],
		strings: [[/'/, { token: TokenClassConsts.STRING, next: '@string' }]],
		string: [
			[/[^']+/, TokenClassConsts.STRING_ESCAPE],
			[/''/, TokenClassConsts.STRING],
			[/'/, { token: TokenClassConsts.STRING, next: '@pop' }]
		],
		complexIdentifiers: [
			[/`/, { token: TokenClassConsts.IDENTIFIER_QUOTE, next: '@quotedIdentifier' }]
		],
		quotedIdentifier: [
			[/[^`]+/, TokenClassConsts.IDENTIFIER_QUOTE],
			[/``/, TokenClassConsts.IDENTIFIER_QUOTE],
			[/`/, { token: TokenClassConsts.IDENTIFIER_QUOTE, next: '@pop' }]
		],
		scopes: [
			[/(EXECUTE\s+)?BEGIN\s+STATEMENT\s+SET/i, TokenClassConsts.KEYWORD_SCOPE],
			[/(EXECUTE\s+)?STATEMENT\s+SET\s+BEGIN/i, TokenClassConsts.KEYWORD_SCOPE]
		],
		complexDataTypes: [
			[/DOUBLE\s+PRECISION\b/i, { token: TokenClassConsts.TYPE }],
			[/WITHOUT\s+TIME\s+ZONE\b/i, { token: TokenClassConsts.TYPE }],
			[/WITH\s+LOCAL\s+TIME\s+ZONE\b/i, { token: TokenClassConsts.TYPE }]
		],
		complexFunctions: [
			[/NOT\s+IN\b/i, { token: TokenClassConsts.PREDEFINED }],
			[/IS\s+JSON\b/i, { token: TokenClassConsts.PREDEFINED }]
		]
	}
};
