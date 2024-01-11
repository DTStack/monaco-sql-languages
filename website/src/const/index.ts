import { LanguageIdEnum } from 'monaco-sql-languages/out/esm/main.js';

export const SUPPORT_LANGUAGES = [
	LanguageIdEnum.FLINK,
	LanguageIdEnum.SPARK,
	LanguageIdEnum.HIVE,
	LanguageIdEnum.MYSQL,
	LanguageIdEnum.TRINO,
	LanguageIdEnum.PG,
	LanguageIdEnum.IMPALA
];

export const CREATE_TASK_ID = 'create.task.id';

export const RUN_SQL_ID = 'editor.run.sql';

export const TASK_TYPE = 'task.type';

export const TASK_PATH = 'task.path';

export const POWERED_BY = 'powered.by';

export const DELETE_TASK_ID = 'delete.task.id';

export const EVENTS = {
	UPDATE_NAME: 'update.name'
} as const;
