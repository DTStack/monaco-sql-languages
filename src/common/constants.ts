export const TokenClassConsts = {
	BINARY: 'binary',
	BINARY_ESCAPE: 'binary.escape',
	COMMENT: 'comment',
	COMMENT_QUOTE: 'comment.quote',
	DELIMITER: 'delimiter',
	DELIMITER_CURLY: 'delimiter.curly',
	DELIMITER_PAREN: 'delimiter.paren',
	DELIMITER_SQUARE: 'delimiter.square',
	IDENTIFIER: 'identifier',
	IDENTIFIER_QUOTE: 'identifier.quote',
	KEYWORD: 'keyword',
	KEYWORD_SCOPE: 'keyword.scope',
	NUMBER: 'number',
	NUMBER_FLOAT: 'number.float',
	NUMBER_BINARY: 'number.binary',
	NUMBER_OCTAL: 'number.octal',
	NUMBER_HEX: 'number.hex',
	OPERATOR: 'operator',
	OPERATOR_KEYWORD: 'operator.keyword',
	OPERATOR_SYMBOL: 'operator.symbol',
	PREDEFINED: 'predefined',
	STRING: 'string',
	STRING_DOUBLE: 'string.double',
	STRING_ESCAPE: 'string.escape',
	TYPE: 'type',
	VARIABLE: 'variable',
	WHITE: 'white'
};

export const postfixTokenClass = (token: string) => token + '.sql';

export enum LanguageIdEnum {
	FLINK = 'flinksql',
	HIVE = 'hivesql',
	MYSQL = 'mysql',
	PG = 'pgsql',
	PL = 'plsql',
	SPARK = 'sparksql',
	SQL = 'sql',
	TRINO = 'trinosql',
	IMPALA = 'impalasql'
}
