/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';
import { registerHiveSQLLanguage } from './hivesql.contribution';
import { tokenClassConsts, postfixTokenClass } from '../common/constants';

registerHiveSQLLanguage();

testTokenization('hivesql', [
	// Comments
	[
		{
			line: '-- a comment',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.COMMENT) }]
		}
	],

	[
		{
			line: '---sticky -- comment',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.COMMENT) }]
		}
	],

	[
		{
			line: '-almost a comment',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.OPERATOR_SYMBOL) },
				{ startIndex: 1, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 7, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 8, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 9, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 10, type: postfixTokenClass(tokenClassConsts.KEYWORD) }
			]
		}
	],

	[
		{
			line: '/* a full line comment */',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.COMMENT_QUOTE) },
				{ startIndex: 2, type: postfixTokenClass(tokenClassConsts.COMMENT) },
				{ startIndex: 23, type: postfixTokenClass(tokenClassConsts.COMMENT_QUOTE) }
			]
		}
	],

	[
		{
			line: '/* /// *** /// */',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.COMMENT_QUOTE) },
				{ startIndex: 2, type: postfixTokenClass(tokenClassConsts.COMMENT) },
				{ startIndex: 15, type: postfixTokenClass(tokenClassConsts.COMMENT_QUOTE) }
			]
		}
	],

	[
		{
			line: 'declare @x int = /* a simple comment */ 1;',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 7, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 8, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 10, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 11, type: postfixTokenClass(tokenClassConsts.TYPE) },
				{ startIndex: 14, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 15, type: postfixTokenClass(tokenClassConsts.OPERATOR_SYMBOL) },
				{ startIndex: 16, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 17, type: postfixTokenClass(tokenClassConsts.COMMENT_QUOTE) },
				{ startIndex: 19, type: postfixTokenClass(tokenClassConsts.COMMENT) },
				{ startIndex: 37, type: postfixTokenClass(tokenClassConsts.COMMENT_QUOTE) },
				{ startIndex: 39, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 40, type: postfixTokenClass(tokenClassConsts.NUMBER) },
				{ startIndex: 41, type: postfixTokenClass(tokenClassConsts.DELIMITER) }
			]
		}
	],

	// Not supporting nested comments, as nested comments seem to not be standard?
	// i.e. http://stackoverflow.com/questions/728172/are-there-multiline-comment-delimiters-in-sql-that-are-vendor-agnostic
	[
		{
			line: '@x=/* a /* nested comment  1*/;',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 2, type: postfixTokenClass(tokenClassConsts.OPERATOR_SYMBOL) },
				{ startIndex: 3, type: postfixTokenClass(tokenClassConsts.COMMENT_QUOTE) },
				{ startIndex: 5, type: postfixTokenClass(tokenClassConsts.COMMENT) },
				{ startIndex: 28, type: postfixTokenClass(tokenClassConsts.COMMENT_QUOTE) },
				{ startIndex: 30, type: postfixTokenClass(tokenClassConsts.DELIMITER) }
			]
		}
	],

	[
		{
			line: '@x=/* another comment */ 1*/;',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 2, type: postfixTokenClass(tokenClassConsts.OPERATOR_SYMBOL) },
				{ startIndex: 3, type: postfixTokenClass(tokenClassConsts.COMMENT_QUOTE) },
				{ startIndex: 5, type: postfixTokenClass(tokenClassConsts.COMMENT) },
				{ startIndex: 22, type: postfixTokenClass(tokenClassConsts.COMMENT_QUOTE) },
				{ startIndex: 24, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 25, type: postfixTokenClass(tokenClassConsts.NUMBER) },
				{ startIndex: 26, type: postfixTokenClass(tokenClassConsts.OPERATOR_SYMBOL) },
				{ startIndex: 28, type: postfixTokenClass(tokenClassConsts.DELIMITER) }
			]
		}
	],

	[
		{
			line: '@x=/*/;',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 2, type: postfixTokenClass(tokenClassConsts.OPERATOR_SYMBOL) },
				{ startIndex: 3, type: postfixTokenClass(tokenClassConsts.COMMENT_QUOTE) },
				{ startIndex: 5, type: postfixTokenClass(tokenClassConsts.COMMENT) }
			]
		}
	],

	// Numbers
	[
		{
			line: '123',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '-123',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.OPERATOR_SYMBOL) },
				{ startIndex: 1, type: postfixTokenClass(tokenClassConsts.NUMBER) }
			]
		}
	],

	[
		{
			line: '0xaBc123',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER_HEX) }]
		}
	],

	[
		{
			line: '0XaBc123',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER_HEX) }]
		}
	],

	[
		{
			line: '0x',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER_HEX) }]
		}
	],

	[
		{
			line: '0x0',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER_HEX) }]
		}
	],

	[
		{
			line: '0xAB_CD',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER_HEX) },
				{ startIndex: 4, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) }
			]
		}
	],

	[
		{
			line: '$',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '$-123',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '$-+-123',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '$123.5678',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '$0.99',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '$.99',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '$99.',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '$0.',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '$.0',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '.',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.DELIMITER) }]
		}
	],

	[
		{
			line: '123',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '123.5678',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '0.99',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '.99',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '99.',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '0.',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '.0',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '1E-2',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '1E+2',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '1E2',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '0.1E2',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '1.E2',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	[
		{
			line: '.1E2',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.NUMBER) }]
		}
	],

	// Identifiers
	[
		{
			line: '_abc$01',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) }]
		}
	],

	[
		{
			line: '#abc$01',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) }]
		}
	],

	[
		{
			line: '##abc$01',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) }]
		}
	],

	[
		{
			line: '@abc$01',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) }]
		}
	],

	[
		{
			line: '@@abc$01',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) }]
		}
	],

	[
		{
			line: '$abc',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) }]
		}
	],
	[
		{
			line: 'declare `abc 321`;',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 7, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 8, type: postfixTokenClass(tokenClassConsts.IDENTIFIER_QUOTE) },
				{ startIndex: 17, type: postfixTokenClass(tokenClassConsts.DELIMITER) }
			]
		}
	],
	[
		{
			line: '`abc` `321` `xyz`',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER_QUOTE) },
				{ startIndex: 5, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 6, type: postfixTokenClass(tokenClassConsts.IDENTIFIER_QUOTE) },
				{ startIndex: 11, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 12, type: postfixTokenClass(tokenClassConsts.IDENTIFIER_QUOTE) }
			]
		}
	],
	[
		{
			line: '`abc',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER_QUOTE) }]
		}
	],

	[
		{
			line: 'int',
			tokens: [{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.TYPE) }]
		}
	],

	// Strings
	[
		{
			line: "'a '' string with quotes'",
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.STRING) },
				{ startIndex: 1, type: postfixTokenClass(tokenClassConsts.STRING_ESCAPE) },
				{ startIndex: 3, type: postfixTokenClass(tokenClassConsts.STRING) },
				{ startIndex: 5, type: postfixTokenClass(tokenClassConsts.STRING_ESCAPE) },
				{ startIndex: 24, type: postfixTokenClass(tokenClassConsts.STRING) }
			]
		}
	],

	[
		{
			line: "'a \" string with quotes'",
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.STRING) },
				{ startIndex: 1, type: postfixTokenClass(tokenClassConsts.STRING_ESCAPE) },
				{ startIndex: 23, type: postfixTokenClass(tokenClassConsts.STRING) }
			]
		}
	],

	[
		{
			line: "'a -- string with comment'",
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.STRING) },
				{ startIndex: 1, type: postfixTokenClass(tokenClassConsts.STRING_ESCAPE) },
				{ startIndex: 25, type: postfixTokenClass(tokenClassConsts.STRING) }
			]
		}
	],

	[
		{
			line: "'a endless string",
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.STRING) },
				{ startIndex: 1, type: postfixTokenClass(tokenClassConsts.STRING_ESCAPE) }
			]
		}
	],

	// Operators
	[
		{
			line: 'SET @x=@x+1',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.KEYWORD) },
				{ startIndex: 3, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 4, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 6, type: postfixTokenClass(tokenClassConsts.OPERATOR_SYMBOL) },
				{ startIndex: 7, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 9, type: postfixTokenClass(tokenClassConsts.OPERATOR_SYMBOL) },
				{ startIndex: 10, type: postfixTokenClass(tokenClassConsts.NUMBER) }
			]
		}
	],

	[
		{
			line: '@x^=@x',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 2, type: postfixTokenClass(tokenClassConsts.OPERATOR_SYMBOL) },
				{ startIndex: 4, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) }
			]
		}
	],

	[
		{
			line: 'WHERE x IS NOT NULL',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.KEYWORD) },
				{ startIndex: 5, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 6, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 7, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 8, type: postfixTokenClass(tokenClassConsts.OPERATOR_KEYWORD) },
				{ startIndex: 10, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 11, type: postfixTokenClass(tokenClassConsts.OPERATOR_KEYWORD) },
				{ startIndex: 14, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 15, type: postfixTokenClass(tokenClassConsts.KEYWORD) }
			]
		}
	],

	[
		{
			line: 'SELECT * FROM dbo.MyTable WHERE MyColumn IN (1,2)',
			tokens: [
				{ startIndex: 0, type: postfixTokenClass(tokenClassConsts.KEYWORD) },
				{ startIndex: 6, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 7, type: postfixTokenClass(tokenClassConsts.OPERATOR_SYMBOL) },
				{ startIndex: 8, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 9, type: postfixTokenClass(tokenClassConsts.KEYWORD) },
				{ startIndex: 13, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 14, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 17, type: postfixTokenClass(tokenClassConsts.DELIMITER) },
				{ startIndex: 18, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 25, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 26, type: postfixTokenClass(tokenClassConsts.KEYWORD) },
				{ startIndex: 31, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 32, type: postfixTokenClass(tokenClassConsts.IDENTIFIER) },
				{ startIndex: 40, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 41, type: postfixTokenClass(tokenClassConsts.OPERATOR_KEYWORD) },
				{ startIndex: 43, type: postfixTokenClass(tokenClassConsts.WHITE) },
				{ startIndex: 44, type: postfixTokenClass(tokenClassConsts.DELIMITER_PAREN) },
				{ startIndex: 45, type: postfixTokenClass(tokenClassConsts.NUMBER) },
				{ startIndex: 46, type: postfixTokenClass(tokenClassConsts.DELIMITER) },
				{ startIndex: 47, type: postfixTokenClass(tokenClassConsts.NUMBER) },
				{ startIndex: 48, type: postfixTokenClass(tokenClassConsts.DELIMITER_PAREN) }
			]
		}
	]
]);
