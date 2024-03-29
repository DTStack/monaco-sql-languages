import 'monaco-sql-languages/out/esm/monaco.contribution.js';
import './languageWorker';
import './theme';
import { setupLanguageFeatures, LanguageIdEnum } from 'monaco-sql-languages/out/esm/main.js';

import { completionService } from './helpers/completionService';

/**
 * replace dtstack custom params, eg: @@{componentParams}, ${taskCustomParams}
 * @param code editor value
 * @returns replaced string
 */
const preprocessCode = (code: string): string => {
	const regex1 = /@@{[A-Za-z0-9._-]*}/g;
	const regex2 = /\${[A-Za-z0-9._-]*}/g;
	let result = code;

	if (regex1.test(code)) {
		result = result.replace(regex1, (str) => {
			return str.replace(/@|{|}|\.|-/g, '_');
		});
	}
	if (regex2.test(code)) {
		result = result.replace(regex2, (str) => {
			return str.replace(/\$|{|}|\.|-/g, '_');
		});
	}
	return result;
};

/**
 * replace dtstack custom grammar, eg: @@{componentParams}, ${taskCustomParams}
 * @param code editor value
 * @param mark some sql grammar need special mark to replace the beginning and the end
 * @returns replaced string
 */
const preprocessCodeHive = (code: string, mark?: string): string => {
	const regex1 = /@@{[A-Za-z0-9._-]*}/g;
	const regex2 = /\${[A-Za-z0-9._-]*}/g;
	let result = code;

	if (regex1.test(code)) {
		result = result.replace(regex1, (str) => {
			if (mark) {
				return str
					.replace(/@/, mark)
					.replace(/}/, mark)
					.replace(/@|{|\.|-/g, '_');
			}
			return str.replace(/@|{|}|\.|-/g, '_');
		});
	}
	if (regex2.test(code)) {
		result = result.replace(regex2, (str) => {
			if (mark) {
				return str.replace(/\$|}/g, mark).replace(/{|\.|-/g, '_');
			}
			return str.replace(/\$|{|}|\.|-/g, '_');
		});
	}
	return result;
};

setupLanguageFeatures({
	languageId: LanguageIdEnum.FLINK,
	completionService,
	preprocessCode
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.SPARK,
	completionService,
	preprocessCode
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.HIVE,
	completionService,
	preprocessCode: (code: string) => preprocessCodeHive(code, '`')
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.MYSQL,
	completionService,
	preprocessCode
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.TRINO,
	completionService,
	preprocessCode
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.PG,
	completionService,
	preprocessCode
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.IMPALA,
	completionService,
	preprocessCode
});
