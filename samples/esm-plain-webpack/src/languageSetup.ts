import { LanguageIdEnum } from 'monaco-sql-languages';
/** import contribution file */
import 'monaco-sql-languages/out/esm/flinksql/flinksql.contribution';

/** define MonacoEnvironment.getWorkerUrl  */
(globalThis as any).MonacoEnvironment = {
	getWorkerUrl: function (_: any, label: string) {
		switch (label) {
			case LanguageIdEnum.FLINK: {
				return './flinksql.worker.js';
			}
			default: {
				return './editor.worker.js';
			}
		}
	}
};
