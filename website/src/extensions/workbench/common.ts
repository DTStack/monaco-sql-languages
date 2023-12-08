export const defaultLanguage = 'FlinkSQL';

export const defaultEditorTab = {
	id: `fixedTab`,
	name: defaultLanguage,
	data: {
		value: ``,
		language: defaultLanguage.toLowerCase()
	}
};

export const defaultLanguageStatusItem = {
	id: `fixedStatusItem`,
	name: defaultLanguage,
	sortIndex: 3
};

export const languages = [
	'FlinkSQL',
	'SparkSQL',
	'HiveSQL',
	'MySQL',
	'PgSQL',
	'SQL',
	'TrinoSQL',
	'ImpalaSQL'
];
