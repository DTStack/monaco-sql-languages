import { TokenClassConsts, postfixTokenClass } from '../../common/constants';
import { editor } from '../../fillers/monaco-editor-core';

/**
 * Inspired by VS Code ColorTheme Default Light+.
 */
export const lightThemeData: editor.IStandaloneThemeData = {
	base: 'vs',
	inherit: true,
	rules: [
		{ token: postfixTokenClass(TokenClassConsts.BINARY), foreground: '098658' },
		{ token: postfixTokenClass(TokenClassConsts.BINARY_ESCAPE), foreground: '098658' },
		{ token: postfixTokenClass(TokenClassConsts.COMMENT), foreground: '008000' },
		{ token: postfixTokenClass(TokenClassConsts.COMMENT_QUOTE), foreground: '008000' },
		{ token: postfixTokenClass(TokenClassConsts.DELIMITER), foreground: '000000' },
		{ token: postfixTokenClass(TokenClassConsts.DELIMITER_CURLY), foreground: '319331' },
		{ token: postfixTokenClass(TokenClassConsts.DELIMITER_PAREN), foreground: '0431fa' },
		{ token: postfixTokenClass(TokenClassConsts.DELIMITER_SQUARE), foreground: '0431fa' },
		{ token: postfixTokenClass(TokenClassConsts.IDENTIFIER), foreground: '001080' },
		{ token: postfixTokenClass(TokenClassConsts.IDENTIFIER_QUOTE), foreground: '001080' },
		{ token: postfixTokenClass(TokenClassConsts.KEYWORD), foreground: '0000ff' },
		{ token: postfixTokenClass(TokenClassConsts.KEYWORD_SCOPE), foreground: 'af00db' },
		{ token: postfixTokenClass(TokenClassConsts.NUMBER), foreground: '098658' },
		{ token: postfixTokenClass(TokenClassConsts.NUMBER_FLOAT), foreground: '098658' },
		{ token: postfixTokenClass(TokenClassConsts.NUMBER_BINARY), foreground: '098658' },
		{ token: postfixTokenClass(TokenClassConsts.NUMBER_OCTAL), foreground: '098658' },
		{ token: postfixTokenClass(TokenClassConsts.NUMBER_HEX), foreground: '098658' },
		{ token: postfixTokenClass(TokenClassConsts.OPERATOR), foreground: '000000' },
		{ token: postfixTokenClass(TokenClassConsts.OPERATOR_KEYWORD), foreground: '0000ff' },
		{ token: postfixTokenClass(TokenClassConsts.OPERATOR_SYMBOL), foreground: '000000' },
		{ token: postfixTokenClass(TokenClassConsts.PREDEFINED), foreground: '795e26' },
		{ token: postfixTokenClass(TokenClassConsts.STRING), foreground: 'a31515' },
		{ token: postfixTokenClass(TokenClassConsts.STRING_ESCAPE), foreground: 'a31515' },
		{ token: postfixTokenClass(TokenClassConsts.TYPE), foreground: '267f99' },
		{ token: postfixTokenClass(TokenClassConsts.VARIABLE), foreground: '4fc1ff' }
	],
	colors: {}
};
