/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TokenClassConsts } from '../../common/constants';
import type { languages } from '../../fillers/monaco-editor-core';

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
		{ open: "'", close: "'" }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" }
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

	// Only consider reserved keywords
	keywords: [
		'ACCESSIBLE',
		'ADD',
		'ALL',
		'ALTER',
		'ANALYZE',
		'AND',
		'AS',
		'ASC',
		'ASENSITIVE',
		'BEFORE',
		'BETWEEN',
		'BIGINT',
		'BINARY',
		'BLOB',
		'BOTH',
		'BY',
		'CALL',
		'CASCADE',
		'CASE',
		'CHANGE',
		'CHAR',
		'CHARACTER',
		'CHECK',
		'COLLATE',
		'COLUMN',
		'CONDITION',
		'CONSTRAINT',
		'CONTINUE',
		'CONVERT',
		'CREATE',
		'CROSS',
		'CUBE',
		'CUME_DIST',
		'CURRENT_DATE',
		'CURRENT_TIME',
		'CURRENT_TIMESTAMP',
		'CURRENT_USER',
		'CURSOR',
		'DATABASE',
		'DATABASES',
		'DAY_HOUR',
		'DAY_MICROSECOND',
		'DAY_MINUTE',
		'DAY_SECOND',
		'DEC',
		'DECIMAL',
		'DECLARE',
		'DEFAULT',
		'DELAYED',
		'DELETE',
		'DENSE_RANK',
		'DESC',
		'DESCRIBE',
		'DETERMINISTIC',
		'DISTINCT',
		'DISTINCTROW',
		'DIV',
		'DOUBLE',
		'DROP',
		'DUAL',
		'EACH',
		'ELSE',
		'ELSEIF',
		'EMPTY',
		'ENCLOSED',
		'ESCAPED',
		'EXCEPT',
		'EXISTS',
		'EXIT',
		'EXPLAIN',
		'FALSE',
		'FETCH',
		'FIRST_VALUE',
		'FLOAT',
		'FLOAT4',
		'FLOAT8',
		'FOR',
		'FORCE',
		'FOREIGN',
		'FROM',
		'FULLTEXT',
		'FUNCTION',
		'GENERATED',
		'GET',
		'GRANT',
		'GROUP',
		'GROUPING',
		'GROUPS',
		'HAVING',
		'HIGH_PRIORITY',
		'HOUR_MICROSECOND',
		'HOUR_MINUTE',
		'HOUR_SECOND',
		'IF',
		'IGNORE',
		'IN',
		'INDEX',
		'INFILE',
		'INNER',
		'INOUT',
		'INSENSITIVE',
		'INSERT',
		'INT',
		'INT1',
		'INT2',
		'INT3',
		'INT4',
		'INT8',
		'INTEGER',
		'INTERVAL',
		'INTO',
		'IO_AFTER_GTIDS',
		'IO_BEFORE_GTIDS',
		'IS',
		'ITERATE',
		'JOIN',
		'JSON_TABLE',
		'KEY',
		'KEYS',
		'KILL',
		'LAG',
		'LAST_VALUE',
		'LATERAL',
		'LEAD',
		'LEADING',
		'LEAVE',
		'LEFT',
		'LIKE',
		'LIMIT',
		'LINEAR',
		'LINES',
		'LOAD',
		'LOCALTIME',
		'LOCALTIMESTAMP',
		'LOCK',
		'LONG',
		'LONGBLOB',
		'LONGTEXT',
		'LOOP',
		'LOW_PRIORITY',
		'MASTER_BIND',
		'MASTER_SSL_VERIFY_SERVER_CERT',
		'MATCH',
		'MAXVALUE',
		'MEDIUMBLOB',
		'MEDIUMINT',
		'MEDIUMTEXT',
		'MIDDLEINT',
		'MINUTE_MICROSECOND',
		'MINUTE_SECOND',
		'MOD',
		'MODIFIES',
		'NATURAL',
		'NOT',
		'NO_WRITE_TO_BINLOG',
		'NTH_VALUE',
		'NTILE',
		'NULL',
		'NUMERIC',
		'OF',
		'ON',
		'OPTIMIZE',
		'OPTIMIZER_COSTS',
		'OPTION',
		'OPTIONALLY',
		'OR',
		'ORDER',
		'OUT',
		'OUTER',
		'OUTFILE',
		'OVER',
		'PARTITION',
		'PERCENT_RANK',
		'PRECISION',
		'PRIMARY',
		'PROCEDURE',
		'PURGE',
		'RANGE',
		'RANK',
		'READ',
		'READS',
		'READ_WRITE',
		'REAL',
		'RECURSIVE',
		'REFERENCES',
		'REGEXP',
		'RELEASE',
		'RENAME',
		'REPEAT',
		'REPLACE',
		'REQUIRE',
		'RESIGNAL',
		'RESTRICT',
		'RETURN',
		'REVOKE',
		'RIGHT',
		'RLIKE',
		'ROW',
		'ROWS',
		'ROW_NUMBER',
		'SCHEMA',
		'SCHEMAS',
		'SECOND_MICROSECOND',
		'SELECT',
		'SENSITIVE',
		'SEPARATOR',
		'SET',
		'SHOW',
		'SIGNAL',
		'SMALLINT',
		'SPATIAL',
		'SPECIFIC',
		'SQL',
		'SQLEXCEPTION',
		'SQLSTATE',
		'SQLWARNING',
		'SQL_BIG_RESULT',
		'SQL_CALC_FOUND_ROWS',
		'SQL_SMALL_RESULT',
		'SSL',
		'STARTING',
		'STORED',
		'STRAIGHT_JOIN',
		'SYSTEM',
		'TABLE',
		'TERMINATED',
		'THEN',
		'TINYBLOB',
		'TINYINT',
		'TINYTEXT',
		'TO',
		'TRAILING',
		'TRIGGER',
		'TRUE',
		'UNDO',
		'UNION',
		'UNIQUE',
		'UNLOCK',
		'UNSIGNED',
		'UPDATE',
		'USAGE',
		'USE',
		'USING',
		'UTC_DATE',
		'UTC_TIME',
		'UTC_TIMESTAMP',
		'VALUES',
		'VARBINARY',
		'VARCHAR',
		'VARCHARACTER',
		'VARYING',
		'VIRTUAL',
		'WHEN',
		'WHERE',
		'WHILE',
		'WINDOW',
		'WITH',
		'WRITE',
		'XOR',
		'YEAR_MONTH',
		'ZEROFILL',

		// part of non-reserved keywords which is common
		'COMMENT',
		'PARTITIONS',
		'PREPARE',
		'REMOVE',
		'REPAIR',
		'RESET',
		'ROLE',
		'STOP',
		'VIEW'
	],
	// https://dev.mysql.com/doc/refman/8.0/en/non-typed-operators.html
	operators: [
		'AND',
		'BETWEEN',
		'IN',
		'LIKE',
		'NOT',
		'REGEXP',
		'EXISTS',
		'OF',
		'OR',
		'IS',
		'NULL',
		'INTERSECT',
		'UNION',
		'INNER',
		'JOIN',
		'LEFT',
		'OUTER',
		'RIGHT',
		'FULL',
		'CROSS'
	],
	// https://dev.mysql.com/doc/refman/8.0/en/built-in-function-reference.html
	builtinFunctions: [
		'ABS',
		'ACOS',
		'ADDDATE',
		'ADDTIME',
		'AES_DECRYPT',
		'AES_ENCRYPT',
		'ANY_VALUE',
		'Area',
		'AsBinary',
		'ASCII',
		'ASIN',
		'AsText',
		'ATAN',
		'ATAN2',
		'AVG',
		'BENCHMARK',
		'BIN',
		'BIT_AND',
		'BIT_COUNT',
		'BIT_LENGTH',
		'BIT_OR',
		'BIT_XOR',
		'Buffer',
		'CASE',
		'CAST',
		'CEIL',
		'CEILING',
		'Centroid',
		'CHAR_LENGTH',
		'CHARACTER_LENGTH',
		'CHARSET',
		'COALESCE',
		'COERCIBILITY',
		'COLLATION',
		'COMPRESS',
		'CONCAT',
		'CONCAT_WS',
		'CONNECTION_ID',
		'Contains',
		'CONV',
		'CONVERT',
		'CONVERT_TZ',
		'ConvexHull',
		'COS',
		'COT',
		'COUNT',
		'CRC32',
		'Crosses',
		'CURDATE',
		'CURRENT_DATE',
		'CURRENT_TIME',
		'CURRENT_TIMESTAMP',
		'CURRENT_USER',
		'CURTIME',
		'DATABASE',
		'DATE_ADD',
		'DATE_FORMAT',
		'DATE_SUB',
		'DATEDIFF',
		'DAY',
		'DAYNAME',
		'DAYOFMONTH',
		'DAYOFWEEK',
		'DAYOFYEAR',
		'DECODE',
		'DEFAULT',
		'DEGREES',
		'DES_DECRYPT',
		'DES_ENCRYPT',
		'Dimension',
		'Disjoint',
		'Distance',
		'DIV',
		'ELT',
		'ENCODE',
		'ENCRYPT',
		'EndPoint',
		'Envelope',
		'Equals',
		'EXP',
		'EXPORT_SET',
		'ExteriorRing',
		'EXTRACT',
		'ExtractValue',
		'FIELD',
		'FIND_IN_SET',
		'FLOOR',
		'FORMAT',
		'FOUND_ROWS',
		'FROM_BASE64',
		'FROM_DAYS',
		'FROM_UNIXTIME',
		'GeomCollFromText',
		'GeomCollFromWKB',
		'GeometryCollection',
		'GeometryN',
		'GeometryType',
		'GeomFromText',
		'GeomFromWKB',
		'GET_FORMAT',
		'GET_LOCK',
		'GLength',
		'GREATEST',
		'GROUP_CONCAT',
		'GTID_SUBSET',
		'GTID_SUBTRACT',
		'HEX',
		'HOUR',
		'IF',
		'IFNULL',
		'INET_ATON',
		'INET_NTOA',
		'INET6_ATON',
		'INET6_NTOA',
		'INSERT',
		'INSTR',
		'InteriorRingN',
		'Intersects',
		'INTERVAL',
		'IS_FREE_LOCK',
		'IS_IPV4',
		'IS_IPV4_COMPAT',
		'IS_IPV4_MAPPED',
		'IS_IPV6',
		// 'IS NOT',
		// 'IS NOT NULL',
		// 'IS NULL',
		'IS_USED_LOCK',
		'IsClosed',
		'IsEmpty',
		'ISNULL',
		'IsSimple',
		'JSON_APPEND',
		'JSON_ARRAY',
		'JSON_ARRAY_APPEND',
		'JSON_ARRAY_INSERT',
		'JSON_ARRAYAGG',
		'JSON_CONTAINS',
		'JSON_CONTAINS_PATH',
		'JSON_DEPTH',
		'JSON_EXTRACT',
		'JSON_INSERT',
		'JSON_KEYS',
		'JSON_LENGTH',
		'JSON_MERGE',
		'JSON_MERGE_PATCH',
		'JSON_MERGE_PRESERVE',
		'JSON_OBJECT',
		'JSON_OBJECTAGG',
		'JSON_PRETTY',
		'JSON_QUOTE',
		'JSON_REMOVE',
		'JSON_REPLACE',
		'JSON_SEARCH',
		'JSON_SET',
		'JSON_STORAGE_SIZE',
		'JSON_TYPE',
		'JSON_UNQUOTE',
		'JSON_VALID',
		'LAST_DAY',
		'LAST_INSERT_ID',
		'LCASE',
		'LEAST',
		'LENGTH',
		'LineFromText',
		'LineFromWKB',
		'LineString',
		'LN',
		'LOAD_FILE',
		'LOCALTIME',
		'LOCALTIMESTAMP',
		'LOCATE',
		'LOG',
		'LOG10',
		'LOG2',
		'LOWER',
		'LPAD',
		'LTRIM',
		'MAKE_SET',
		'MAKEDATE',
		'MAKETIME',
		'MASTER_POS_WAIT',
		'MATCH',
		'MAX',
		'MBRContains',
		'MBRCoveredBy',
		'MBRCovers',
		'MBRDisjoint',
		'MBREqual',
		'MBREquals',
		'MBRIntersects',
		'MBROverlaps',
		'MBRTouches',
		'MBRWithin',
		'MD5',
		'MEMBER',
		'MICROSECOND',
		'MID',
		'MIN',
		'MINUTE',
		'MLineFromText',
		'MLineFromWKB',
		'MOD',
		'MONTH',
		'MONTHNAME',
		'MPointFromText',
		'MPointFromWKB',
		'MPolyFromText',
		'MPolyFromWKB',
		'MultiLineString',
		'MultiPoint',
		'MultiPolygon',
		'NAME_CONST',
		// 'NOT IN',
		// 'NOT LIKE',
		// 'NOT REGEXP',
		'NOW',
		'NULLIF',
		'NumGeometries',
		'NumInteriorRings',
		'NumPoints',
		'OCT',
		'OCTET_LENGTH',
		'ORD',
		'Overlaps',
		'PASSWORD',
		'PERIOD_ADD',
		'PERIOD_DIFF',
		'PI',
		'Point',
		'PointFromText',
		'PointFromWKB',
		'PointN',
		'PolyFromText',
		'PolyFromWKB',
		'Polygon',
		'POSITION',
		'POW',
		'POWER',
		// 'PROCEDURE ANALYSE',
		'QUARTER',
		'QUOTE',
		'RADIANS',
		'RAND',
		'RANDOM_BYTES',
		'RELEASE_ALL_LOCKS',
		'RELEASE_LOCK',
		'REPEAT',
		'REPLACE',
		'REVERSE',
		'RLIKE',
		'ROUND',
		'ROW_COUNT',
		'RPAD',
		'RTRIM',
		'SCHEMA',
		'SEC_TO_TIME',
		'SECOND',
		'SESSION_USER',
		'SHA1',
		'SHA2',
		'SIGN',
		'SIN',
		'SLEEP',
		'SOUNDEX',
		// 'SOUNDS LIKE',
		'SPACE',
		'SQRT',
		'SRID',
		'ST_Area',
		'ST_AsBinary',
		'ST_AsGeoJSON',
		'ST_AsText',
		'ST_Buffer',
		'ST_Buffer_Strategy',
		'ST_Centroid',
		'ST_Contains',
		'ST_ConvexHull',
		'ST_Crosses',
		'ST_Difference',
		'ST_Dimension',
		'ST_Disjoint',
		'ST_Distance',
		'ST_Distance_Sphere',
		'ST_EndPoint',
		'ST_Envelope',
		'ST_Equals',
		'ST_ExteriorRing',
		'ST_GeoHash',
		'ST_GeomCollFromText',
		'ST_GeomCollFromWKB',
		'ST_GeometryN',
		'ST_GeometryType',
		'ST_GeomFromGeoJSON',
		'ST_GeomFromText',
		'ST_GeomFromWKB',
		'ST_InteriorRingN',
		'ST_Intersection',
		'ST_Intersects',
		'ST_IsClosed',
		'ST_IsEmpty',
		'ST_IsSimple',
		'ST_IsValid',
		'ST_LatFromGeoHash',
		'ST_Length',
		'ST_LineFromText',
		'ST_LineFromWKB',
		'ST_LongFromGeoHash',
		'ST_MakeEnvelope',
		'ST_MLineFromText',
		'ST_MLineFromWKB',
		'ST_MPointFromText',
		'ST_MPointFromWKB',
		'ST_MPolyFromText',
		'ST_MPolyFromWKB',
		'ST_NumGeometries',
		'ST_NumInteriorRing',
		'ST_NumPoints',
		'ST_Overlaps',
		'ST_PointFromGeoHash',
		'ST_PointFromText',
		'ST_PointFromWKB',
		'ST_PointN',
		'ST_PolyFromText',
		'ST_PolyFromWKB',
		'ST_Simplify',
		'ST_SRID',
		'ST_StartPoint',
		'ST_SymDifference',
		'ST_Touches',
		'ST_Union',
		'ST_Validate',
		'ST_Within',
		'ST_X',
		'ST_Y',
		'StartPoint',
		'STD',
		'STDDEV',
		'STDDEV_POP',
		'STDDEV_SAMP',
		'STR_TO_DATE',
		'STRCMP',
		'SUBDATE',
		'SUBSTR',
		'SUBSTRING',
		'SUBSTRING_INDEX',
		'SUBTIME',
		'SUM',
		'SYSDATE',
		'SYSTEM_USER',
		'TAN',
		'TIME_FORMAT',
		'TIME_TO_SEC',
		'TIMEDIFF',
		'TIMESTAMPADD',
		'TIMESTAMPDIFF',
		'TO_BASE64',
		'TO_DAYS',
		'TO_SECONDS',
		'Touches',
		'TRIM',
		'TRUNCATE',
		'UCASE',
		'UNCOMPRESS',
		'UNCOMPRESSED_LENGTH',
		'UNHEX',
		'UNIX_TIMESTAMP',
		'UpdateXML',
		'UPPER',
		'USER',
		'UTC_DATE',
		'UTC_TIME',
		'UTC_TIMESTAMP',
		'UUID',
		'UUID_SHORT',
		'VALIDATE_PASSWORD_STRENGTH',
		'VALUES',
		'VAR_POP',
		'VAR_SAMP',
		'VARIANCE',
		'VERSION',
		'WAIT_FOR_EXECUTED_GTID_SET',
		'WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS',
		'WEEK',
		'WEEKDAY',
		'WEEKOFYEAR',
		'WEIGHT_STRING',
		'Within',
		'X',
		'XOR',
		'Y',
		'YEARWEEK',
		// The following function names are the new additions in v8.0
		'asynchronous_connection_failover_add_managed',
		'asynchronous_connection_failover_add_source',
		'asynchronous_connection_failover_delete_managed',
		'asynchronous_connection_failover_delete_source',
		'asynchronous_connection_failover_reset',
		'BIN_TO_UUID',
		'CAN_ACCESS_COLUMN',
		'CAN_ACCESS_DATABASE',
		'CAN_ACCESS_TABLE',
		'CAN_ACCESS_USER',
		'CAN_ACCESS_VIEW',
		'CUME_DIST',
		'CURRENT_ROLE',
		'DENSE_RANK',
		'FIRST_VALUE',
		'FORMAT_BYTES',
		'FORMAT_PICO_TIME',
		'GeomCollection',
		'GET_DD_COLUMN_PRIVILEGES',
		'GET_DD_CREATE_OPTIONS',
		'GET_DD_INDEX_SUB_PART_LENGTH',
		'group_replication_disable_member_action',
		'group_replication_enable_member_action',
		'group_replication_get_communication_protocol',
		'group_replication_get_write_concurrency',
		'group_replication_reset_member_actions',
		'group_replication_set_as_primary',
		'group_replication_set_communication_protocol',
		'group_replication_set_write_concurrency',
		'group_replication_switch_to_multi_primary_mode',
		'group_replication_switch_to_single_primary_mode',
		'GROUPING',
		'ICU_VERSION',
		'INTERNAL_AUTO_INCREMENT',
		'INTERNAL_AVG_ROW_LENGTH',
		'INTERNAL_CHECK_TIME',
		'INTERNAL_CHECKSUM',
		'INTERNAL_DATA_FREE',
		'INTERNAL_DATA_LENGTH',
		'INTERNAL_DD_CHAR_LENGTH',
		'INTERNAL_GET_COMMENT_OR_ERROR',
		'INTERNAL_GET_ENABLED_ROLE_JSON',
		'INTERNAL_GET_HOSTNAME',
		'INTERNAL_GET_USERNAME',
		'INTERNAL_GET_VIEW_WARNING_OR_ERROR',
		'INTERNAL_INDEX_COLUMN_CARDINALITY',
		'INTERNAL_INDEX_LENGTH',
		'INTERNAL_IS_ENABLED_ROLE',
		'INTERNAL_IS_MANDATORY_ROLE',
		'INTERNAL_KEYS_DISABLED',
		'INTERNAL_MAX_DATA_LENGTH',
		'INTERNAL_TABLE_ROWS',
		'INTERNAL_UPDATE_TIME',
		'IS_UUID',
		'JSON_OVERLAPS',
		'JSON_SCHEMA_VALID',
		'JSON_SCHEMA_VALIDATION_REPORT',
		'JSON_STORAGE_FREE',
		'JSON_TABLE',
		'JSON_VALUE',
		'LAG',
		'LAST_VALUE',
		'LEAD',
		// 'MEMBER OF',
		'NTH_VALUE',
		'NTILE',
		'PERCENT_RANK',
		'PS_CURRENT_THREAD_ID',
		'PS_THREAD_ID',
		'RANK',
		'REGEXP_INSTR',
		'REGEXP_LIKE',
		'REGEXP_REPLACE',
		'REGEXP_SUBSTR',
		'ROLES_GRAPHML',
		'ROW_NUMBER',
		'SOURCE_POS_WAIT',
		'ST_Collect',
		'ST_FrechetDistance',
		'ST_HausdorffDistance',
		'ST_Latitude',
		'ST_LineInterpolatePoint',
		'ST_LineInterpolatePoints',
		'ST_Longitude',
		'ST_PointAtDistance',
		'ST_SwapXY',
		'ST_Transform',
		'STATEMENT_DIGEST',
		'STATEMENT_DIGEST_TEXT',
		'UUID_TO_BIN'
	],
	builtinVariables: [
		// NOT SUPPORTED
	],
	// https://dev.mysql.com/doc/refman/8.0/en/storage-requirements.html
	typeKeywords: [
		// Numeric Types
		'TINYINT',
		'SMALLINT',
		'MEDIUMINT',
		'INT',
		'INTEGER',
		'BIGINT',
		'FLOAT',
		'DOUBLE',
		'REAL',
		'DECIMAL',
		'NUMERIC',
		'BIT',
		// Date and Time Types
		'YEAR',
		'DATE',
		'TIME',
		'DATETIME',
		'TIMESTAMP',
		// String Types
		'CHAR',
		'BINARY',
		'VARCHAR',
		'VARBINARY',
		'TINYBLOB',
		'TINYTEXT',
		'BLOB',
		'TEXT',
		'MEDIUMBLOB',
		'MEDIUMTEXT',
		'LONGBLOB',
		'LONGTEXT',
		'ENUM',
		'SET',
		// Spatial Types
		'GEOMETRY',
		'POINT',
		'LINESTRING',
		'POLYGON',
		'MULTIPOINT',
		'MULTILINESTRING',
		'MULTIPOLYGON',
		'GEOMETRYCOLLECTION',
		// JSON Types
		'JSON',
		'JSON_STORAGE_SIZE',
		'JSON_SET',
		'JSON_INSERT',
		'JSON_REPLACE',
		'JSON_REMOVE',
		'JSON_STORAGE_FREE',
		'JSON_TYPE',
		'JSON_ARRAY',
		'JSON_OBJECT',
		'JSON_MERGE_PRESERVE',
		'JSON_MERGE_PATCH',
		'JSON_CONTAINS_PATH',
		'JSON_MERGE',
		'JSON_VALID',
		'JSON_UNQUOTE',
		'JSON_EXTRACT',
		// Misc Types
		'BOOLEAN'
	],
	scopeKeywords: ['BEGIN', 'CASE', 'END', 'WHEN', 'THEN', 'ELSE'],
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
			{ include: '@complexOperators' },
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
		comments: [
			[/--+.*/, TokenClassConsts.COMMENT],
			[/#+.*/, TokenClassConsts.COMMENT],
			[/\/\*/, { token: TokenClassConsts.COMMENT_QUOTE, next: '@comment' }]
		],
		whitespace: [[/\s+/, TokenClassConsts.WHITE]],
		comment: [
			[/[^*/]+/, TokenClassConsts.COMMENT],
			// Not supporting nested comments, as nested comments seem to not be standard?
			// i.e. http://stackoverflow.com/questions/728172/are-there-multiline-comment-delimiters-in-sql-that-are-vendor-agnostic
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
		strings: [
			[/'/, { token: TokenClassConsts.STRING, next: '@stringSingle' }],
			[/"/, { token: TokenClassConsts.STRING, next: '@stringDouble' }]
		],
		stringSingle: [
			[/\\'/, TokenClassConsts.STRING_ESCAPE],
			[/[^']+/, TokenClassConsts.STRING_ESCAPE],
			[/''/, TokenClassConsts.STRING],
			[/'/, { token: TokenClassConsts.STRING, next: '@pop' }]
		],
		stringDouble: [
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
		scopes: [
			// NOT SUPPORTED
		],
		complexOperators: [
			[/IS\s+NOT\s+(NULL)?\b/i, { token: TokenClassConsts.OPERATOR_KEYWORD }],
			[/IS\s+NULL\b/i, { token: TokenClassConsts.OPERATOR_KEYWORD }],
			[/NOT\s+(IN|LIKE|REGEXP)\b/i, { token: TokenClassConsts.OPERATOR_KEYWORD }],
			[/PROCEDURE\s+ANALYSE\b/i, { token: TokenClassConsts.OPERATOR_KEYWORD }],
			[/SOUNDS\s+LIKE\b/i, { token: TokenClassConsts.OPERATOR_KEYWORD }],
			[/MEMBER\s+OF\b/i, { token: TokenClassConsts.OPERATOR_KEYWORD }]
		]
	}
};
