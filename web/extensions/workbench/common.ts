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
	name: defaultLanguage
};

export const languages = ['FlinkSQL', 'SparkSQL', 'HiveSQL', 'MySQL', 'SQL', 'PlSQL', 'PgSQL'];
