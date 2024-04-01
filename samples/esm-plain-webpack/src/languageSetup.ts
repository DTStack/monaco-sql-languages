import { LanguageIdEnum } from 'monaco-sql-languages';

/** import contribution files */
import 'monaco-sql-languages/esm/languages/mysql/mysql.contribution';
import 'monaco-sql-languages/esm/languages/flink/flink.contribution';
import 'monaco-sql-languages/esm/languages/spark/spark.contribution';
import 'monaco-sql-languages/esm/languages/hive/hive.contribution';
import 'monaco-sql-languages/esm/languages/trino/trino.contribution';
import 'monaco-sql-languages/esm/languages/pgsql/pgsql.contribution';
import 'monaco-sql-languages/esm/languages/impala/impala.contribution';

/** define MonacoEnvironment.getWorkerUrl  */
(globalThis as any).MonacoEnvironment = {
	getWorkerUrl: function (_moduleId: string, label: string) {
		switch (label) {
			case LanguageIdEnum.MYSQL: {
				return './mysql.worker.js';
			}
			case LanguageIdEnum.SPARK: {
				return './spark.worker.js';
			}
			case LanguageIdEnum.FLINK: {
				return './flink.worker.js';
			}
			case LanguageIdEnum.HIVE: {
				return './hive.worker.js';
			}
			case LanguageIdEnum.TRINO: {
				return './trino.worker.js';
			}
			case LanguageIdEnum.PG: {
				return './pgsql.worker.js';
			}
			case LanguageIdEnum.IMPALA: {
				return './impala.worker.js';
			}
			default: {
				return './editor.worker.js';
			}
		}
	}
};
