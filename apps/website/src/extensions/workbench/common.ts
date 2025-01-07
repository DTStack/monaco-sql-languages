export const languages = [
	'FlinkSQL',
	'SparkSQL',
	'HiveSQL',
	'MySQL',
	'PGSQL',
	'TrinoSQL',
	'ImpalaSQL'
];

export const defaultLanguage = languages[0];

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
