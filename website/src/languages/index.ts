import 'monaco-sql-languages/out/esm/monaco.contribution.js';
import './languageWorker';
import './theme';
import { setupLanguageFeatures, LanguageIdEnum } from 'monaco-sql-languages/out/esm/main.js';

import { completionService } from './helpers/completionService';

setupLanguageFeatures({
	languageId: LanguageIdEnum.FLINK,
	completionService
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.SPARK,
	completionService
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.HIVE,
	completionService
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.TRINO,
	completionService
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.PG,
	completionService
});
