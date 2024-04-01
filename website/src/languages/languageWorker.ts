// @ts-nocheck
import { LanguageIdEnum } from 'monaco-sql-languages/esm/main.js';

import EditorWorker from '../../node_modules/monaco-editor/esm/vs/editor/editor.worker?worker';
import FlinkSQLWorker from 'monaco-sql-languages/esm/languages/flink/flink.worker?worker';
import SparkSQLWorker from 'monaco-sql-languages/esm/languages/spark/spark.worker?worker';
import HiveSQLWorker from 'monaco-sql-languages/esm/languages/hive/hive.worker?worker';
import PGSQLWorker from 'monaco-sql-languages/esm/languages/pgsql/pgsql.worker?worker';
import MySQLWorker from 'monaco-sql-languages/esm/languages/mysql/mysql.worker?worker';
import TrinoSQLWorker from 'monaco-sql-languages/esm/languages/trino/trino.worker?worker';
import ImpalaSQLWorker from 'monaco-sql-languages/esm/languages/impala/impala.worker?worker';

(globalThis as any).MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === LanguageIdEnum.FLINK) {
			return new FlinkSQLWorker();
		}
		if (label === LanguageIdEnum.HIVE) {
			return new HiveSQLWorker();
		}
		if (label === LanguageIdEnum.SPARK) {
			return new SparkSQLWorker();
		}
		if (label === LanguageIdEnum.PG) {
			return new PGSQLWorker();
		}
		if (label === LanguageIdEnum.MYSQL) {
			return new MySQLWorker();
		}
		if (label === LanguageIdEnum.TRINO) {
			return new TrinoSQLWorker();
		}
		if (label === LanguageIdEnum.IMPALA) {
			return new ImpalaSQLWorker();
		}
		return new EditorWorker();
	}
};
