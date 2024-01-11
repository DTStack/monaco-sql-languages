import { LanguageIdEnum } from 'monaco-sql-languages/out/esm/main.js';
import {
	FlinkIcon,
	HiveIcon,
	ImpalaIcon,
	MysqlIcon,
	PostgreSqlIcon,
	SparkIcon,
	TrinoIcon
} from '.';
import React from 'react';

export function helper(id?: string) {
	if (!id) return React.Fragment;
	switch (id) {
		case LanguageIdEnum.FLINK: {
			return FlinkIcon;
		}
		case LanguageIdEnum.SPARK: {
			return SparkIcon;
		}
		case LanguageIdEnum.HIVE: {
			return HiveIcon;
		}
		case LanguageIdEnum.MYSQL: {
			return MysqlIcon;
		}
		case LanguageIdEnum.TRINO: {
			return TrinoIcon;
		}
		case LanguageIdEnum.PG: {
			return PostgreSqlIcon;
		}
		case LanguageIdEnum.IMPALA: {
			return ImpalaIcon;
		}

		default:
			return React.Fragment;
	}
}
