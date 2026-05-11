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
		'ADD',
		'ALL',
		'ALTER',
		'AND',
		'AS',
		'ASC',
		'BETWEEN',
		'BY',
		'CASE',
		'CAST',
		'CHECK',
		'COALESCE',
		'COLUMN',
		'CONSTRAINT',
		'CREATE',
		'CROSS',
		'DEFAULT',
		'DELETE',
		'DESC',
		'DISTINCT',
		'DROP',
		'ELSE',
		'END',
		'ESCAPE',
		'EXCEPT',
		'EXISTS',
		'FALSE',
		'FIRST',
		'FOREIGN',
		'FROM',
		'FULL',
		'GROUP',
		'HAVING',
		'IF',
		'IN',
		'INNER',
		'INSERT',
		'INTERSECT',
		'INTO',
		'IS',
		'JOIN',
		'KEY',
		'LAST',
		'LEFT',
		'LIKE',
		'LIMIT',
		'NOT',
		'NULL',
		'NULLIF',
		'NULLS',
		'OFFSET',
		'ON',
		'OR',
		'ORDER',
		'OUTER',
		'PRIMARY',
		'RECURSIVE',
		'REFERENCES',
		'RENAME',
		'RIGHT',
		'SELECT',
		'SET',
		'TABLE',
		'THEN',
		'TO',
		'TRUE',
		'UNION',
		'UNIQUE',
		'UPDATE',
		'VALUES',
		'WHEN',
		'WHERE',
		'WITH'
	],
	operators: [
		'AND',
		'BETWEEN',
		'IN',
		'LIKE',
		'NOT',
		'EXISTS',
		'OR',
		'IS',
		'UNION',
		'INTERSECT',
		'EXCEPT',
		'JOIN',
		'CROSS',
		'INNER',
		'OUTER',
		'FULL',
		'LEFT',
		'RIGHT'
	],
	builtinFunctions: [
		'AVG',
		'COUNT',
		'FIRST_VALUE',
		'LAG',
		'LAST_VALUE',
		'LEAD',
		'MAX',
		'MIN',
		'NTH_VALUE',
		'NTILE',
		'PERCENT_RANK',
		'RANK',
		'ROW_NUMBER',
		'SUM',
		'STDDEV',
		'STDDEV_POP',
		'STDDEV_SAMP',
		'VAR_POP',
		'VAR_SAMP',
		'VARIANCE'
	],
	builtinVariables: [
		// Not supported
	],
	typeKeywords: [
		'BOOLEAN',
		'TINYINT',
		'SMALLINT',
		'INT',
		'INTEGER',
		'BIGINT',
		'FLOAT',
		'DOUBLE',
		'DECIMAL',
		'NUMERIC',
		'VARCHAR',
		'CHAR',
		'TEXT',
		'DATE',
		'TIME',
		'TIMESTAMP',
		'BINARY',
		'VARBINARY'
	],
	scopeKeywords: ['CASE', 'END', 'WHEN', 'THEN', 'ELSE'],
	pseudoColumns: [
		// Not supported
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
			[/[:;,.]/, TokenClassConsts.DELIMITER],
			[/[\(\)\[\]\{\}]/, '@brackets'],
			[
				/[\w@]+/,
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
			[/`/, { token: TokenClassConsts.IDENTIFIER_QUOTE, next: '@quotedIdentifier' }],
			[/"/, { token: TokenClassConsts.IDENTIFIER_QUOTE, next: '@doubleQuotedIdentifier' }]
		],
		quotedIdentifier: [
			[/[^`]+/, TokenClassConsts.IDENTIFIER_QUOTE],
			[/``/, TokenClassConsts.IDENTIFIER_QUOTE],
			[/`/, { token: TokenClassConsts.IDENTIFIER_QUOTE, next: '@pop' }]
		],
		doubleQuotedIdentifier: [
			[/[^"]+/, TokenClassConsts.IDENTIFIER_QUOTE],
			[/""/, TokenClassConsts.IDENTIFIER_QUOTE],
			[/"/, { token: TokenClassConsts.IDENTIFIER_QUOTE, next: '@pop' }]
		],
		scopes: [
			// Not supported
		]
	}
};
