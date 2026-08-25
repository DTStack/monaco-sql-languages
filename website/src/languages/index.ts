import 'monaco-sql-languages/esm/all.contributions.js';
import './languageWorker';
import './theme';
import 'monaco-sql-languages/esm/format.entry';

import {
	type FormatFallback,
	LanguageIdEnum,
	setupLanguageFeatures
} from 'monaco-sql-languages/esm/main.js';

import { completionService } from './helpers/completionService';

/** Demo fallback when sql-formatter fails; shared by feature setup and toolbar. */
export const formatFallback: FormatFallback = (code) => `-- formatted by demo fallback\n${code}`;

const formatFeatureOptions = {
	enable: true,
	fallback: formatFallback
} as const;

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
setupLanguageFeatures(LanguageIdEnum.FLINK, {
	completionItems: {
		enable: true,
		completionService
	},
	references: true,
	definitions: true,
	hover: true,
	format: formatFeatureOptions,
	preprocessCode
});

setupLanguageFeatures(LanguageIdEnum.SPARK, {
	completionItems: {
		enable: true,
		completionService
	},
	references: true,
	definitions: true,
	hover: true,
	format: formatFeatureOptions,
	preprocessCode
});

setupLanguageFeatures(LanguageIdEnum.HIVE, {
	completionItems: {
		enable: true,
		completionService
	},
	references: true,
	definitions: true,
	hover: true,
	format: formatFeatureOptions,
	preprocessCode: (code: string) => preprocessCodeHive(code, '`')
});

setupLanguageFeatures(LanguageIdEnum.MYSQL, {
	completionItems: {
		enable: true,
		completionService
	},
	references: true,
	definitions: true,
	hover: true,
	format: formatFeatureOptions,
	preprocessCode
});

setupLanguageFeatures(LanguageIdEnum.TRINO, {
	completionItems: {
		enable: true,
		completionService
	},
	references: true,
	definitions: true,
	hover: true,
	format: formatFeatureOptions,
	preprocessCode
});

setupLanguageFeatures(LanguageIdEnum.PG, {
	completionItems: {
		enable: true,
		completionService
	},
	references: true,
	definitions: true,
	hover: true,
	format: formatFeatureOptions,
	preprocessCode
});

setupLanguageFeatures(LanguageIdEnum.IMPALA, {
	completionItems: {
		enable: true,
		completionService
	},
	references: true,
	definitions: true,
	hover: true,
	format: formatFeatureOptions,
	preprocessCode
});

setupLanguageFeatures(LanguageIdEnum.GENERIC, {
	completionItems: {
		enable: true,
		completionService
	},
	diagnostics: false,
	references: true,
	definitions: true,
	hover: true,
	format: formatFeatureOptions,
	preprocessCode
});
