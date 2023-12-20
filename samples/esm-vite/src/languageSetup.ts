import { LanguageIdEnum } from 'monaco-sql-languages';
/** import contribution file */
import 'monaco-sql-languages/out/esm/flinksql/flinksql.contribution';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
/** import transformed worker file */
import FlinkSQLWorker from './workerTransform/flinksql.worker?worker';

/** define MonacoEnvironment.getWorker  */
(self as any).MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === LanguageIdEnum.FLINK) {
			return new FlinkSQLWorker();
		}
		return new EditorWorker();
	}
};
