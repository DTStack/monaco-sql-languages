// @ts-nocheck
import EditorWorker from '../../node_modules/monaco-editor/esm/vs/editor/editor.worker?worker';

import FlinkSQLWorker from 'monaco-sql-languages/esm/languages/flink/flink.worker?worker';
import SparkSQLWorker from 'monaco-sql-languages/esm/languages/spark/spark.worker?worker';
import HiveSQLWorker from 'monaco-sql-languages/esm/languages/hive/hive.worker?worker';
import PGSQLWorker from 'monaco-sql-languages/esm/languages/pgsql/pgsql.worker?worker';
import MySQLWorker from 'monaco-sql-languages/esm/languages/mysql/mysql.worker?worker';
import TrinoSQLWorker from 'monaco-sql-languages/esm/languages/trino/trino.worker?worker';
import ImpalaSQLWorker from 'monaco-sql-languages/esm/languages/impala/impala.worker?worker';

self.MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === 'flinksql') {
			return new FlinkSQLWorker();
		}
		if (label === 'hivesql') {
			return new HiveSQLWorker();
		}
		if (label === 'sparksql') {
			return new SparkSQLWorker();
		}
		if (label === 'pgsql') {
			return new PGSQLWorker();
		}
		if (label === 'plsql') {
			return new PLSQLWorker();
		}
		if (label === 'mysql' || label === 'sql') {
			return new MySQLWorker();
		}
		if (label === 'trinosql') {
			return new TrinoSQLWorker();
		}
		if (label === 'impalasql') {
			return new ImpalaSQLWorker();
		}
		return new EditorWorker();
	}
};
