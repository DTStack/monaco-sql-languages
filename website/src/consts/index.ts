export const QUICK_GITHUB = 'quick.github';

export const FILE_PATH = 'file.path';

export const PARSE_LANGUAGE = 'parse.language';

export const ACTIVITY_FOLDER = 'activity.folder';

export const ACTIVITY_SQL = 'activity.sql';

export const ACTIVITY_API = 'activity.api';

export const SOURCE_FILE = 'activity.source.file';

export const SOURCE_OUTLINE = 'activity.source.outline';

export const PARSE_TREE = 'panel.item.visualizer';

export const QUICK_GITHUB_HREF = [
	{
		href: 'https://github.com/DTStack/dt-sql-parser',
		title: 'dt-sql-parser'
	},
	{
		href: 'https://github.com/DTStack/monaco-sql-languages',
		title: 'monaco-sql-languages'
	},
	{
		href: 'https://github.com/DTStack/dt-react-monaco-editor',
		title: 'dt-react-monaco-editor'
	}
];

export const SQL_LANGUAGES = [
	'HiveSQL',
	'SparkSQL',
	'FlinkSQL',
	'MySQL',
	'PGSQL',
	'TrinoSQL',
	'ImpalaSQL'
];

export const defaultLanguage = SQL_LANGUAGES[0];

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
