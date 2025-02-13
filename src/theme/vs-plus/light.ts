import { TokenClassConsts, postfixTokenClass } from '../../common/constants';
import { editor } from '../../fillers/monaco-editor-core';

/**
 * Inspired by VS Code ColorTheme Default Light+.
 */
export const lightThemeData: editor.IStandaloneThemeData = {
	base: 'vs',
	inherit: true,
	rules: [
		{ token: postfixTokenClass(TokenClassConsts.BINARY), foreground: '45AB5A' },
		{ token: postfixTokenClass(TokenClassConsts.BINARY_ESCAPE), foreground: '45AB5A' },
		{ token: postfixTokenClass(TokenClassConsts.NUMBER), foreground: '45AB5A' },
		{ token: postfixTokenClass(TokenClassConsts.NUMBER_FLOAT), foreground: '45AB5A' },
		{ token: postfixTokenClass(TokenClassConsts.NUMBER_BINARY), foreground: '45AB5A' },
		{ token: postfixTokenClass(TokenClassConsts.NUMBER_OCTAL), foreground: '45AB5A' },
		{ token: postfixTokenClass(TokenClassConsts.NUMBER_HEX), foreground: '45AB5A' },
		{ token: postfixTokenClass(TokenClassConsts.COMMENT), foreground: 'B1B4C5' },
		{ token: postfixTokenClass(TokenClassConsts.COMMENT_QUOTE), foreground: 'B1B4C5' },
		{ token: postfixTokenClass(TokenClassConsts.DELIMITER), foreground: '7D98B1' },
		{ token: postfixTokenClass(TokenClassConsts.OPERATOR), foreground: '7D98B1' },
		{ token: postfixTokenClass(TokenClassConsts.OPERATOR_SYMBOL), foreground: '7D98B1' },
		{ token: postfixTokenClass(TokenClassConsts.DELIMITER_CURLY), foreground: 'B1BB86' },
		{ token: postfixTokenClass(TokenClassConsts.DELIMITER_PAREN), foreground: 'B1BB86' },
		{ token: postfixTokenClass(TokenClassConsts.DELIMITER_SQUARE), foreground: 'B1BB86' },
		{ token: postfixTokenClass(TokenClassConsts.IDENTIFIER), foreground: '201A1A' },
		{ token: postfixTokenClass(TokenClassConsts.IDENTIFIER_QUOTE), foreground: '201A1A' },
		{ token: postfixTokenClass(TokenClassConsts.KEYWORD), foreground: '3300FF' },
		{ token: postfixTokenClass(TokenClassConsts.OPERATOR_KEYWORD), foreground: '3300FF' },
		{ token: postfixTokenClass(TokenClassConsts.KEYWORD_SCOPE), foreground: 'E221DA' },
		{ token: postfixTokenClass(TokenClassConsts.PREDEFINED), foreground: 'C3771C' },
		{ token: postfixTokenClass(TokenClassConsts.STRING), foreground: 'BC1313' },
		{ token: postfixTokenClass(TokenClassConsts.STRING_ESCAPE), foreground: 'BC1313' },
		{ token: postfixTokenClass(TokenClassConsts.TYPE), foreground: '256FC6' },
		{ token: postfixTokenClass(TokenClassConsts.VARIABLE), foreground: '00AD84' }
	],
	colors: {}
};
