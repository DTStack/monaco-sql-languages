import { languages } from 'monaco-editor/esm/vs/editor/editor.api';
import { ICompletionItem } from 'monaco-sql-languages/esm/languageService';

const catalogList = ['mock_catalog_1', 'mock_catalog_2', 'mock_catalog_3'];
const schemaList = ['mock_schema_1', 'mock_schema_2', 'mock_schema_3'];
const databaseList = ['mock_database_1', 'mock_database_2', 'mock_database_3'];
const tableList = ['mock_table1', 'mock_table2', 'mock_table3'];
const viewList = ['mock_view1', 'mock_view2', 'mock_view3'];

const tmpDatabaseList = ['current_catalog_db1', 'current_catalog_db2', 'current_catalog_db3'];
const tmpSchemaList = [
	'current_catalog_schema1',
	'current_catalog_schema2',
	'current_catalog_schema3'
];
const tmpTableList = ['current_db_table1', 'current_db_table2', 'current_db_table3'];
const tmpViewList = ['current_db_view1', 'current_db_view2', 'current_db_view3'];

const prefixLabel = (languageId: string, text: string) => {
	const prefix = languageId ? languageId.replace(/sql/gi, '').toLocaleLowerCase() : '';
	return prefix ? `${prefix}_${text}` : text;
};

/**
 * Get all catalogs
 */
export function getCatalogs(languageId: string) {
	const catCompletions = catalogList.map((cat) => ({
		label: prefixLabel(languageId, cat),
		kind: languages.CompletionItemKind.Field,
		detail: 'Remote: catalog',
		sortText: '1' + prefixLabel(languageId, cat)
	}));
	return Promise.resolve(catCompletions);
}

/**
 * Get databases based on catalog
 */
export function getDataBases(languageId: string, catalog?: string) {
	const databases = catalog ? databaseList : tmpDatabaseList;

	const databaseCompletions = databases.map((db) => ({
		label: prefixLabel(languageId, db),
		kind: languages.CompletionItemKind.Field,
		detail: 'Remote: database',
		sortText: '1' + prefixLabel(languageId, db)
	}));

	return Promise.resolve(databaseCompletions);
}

/**
 * Get schemas based on catalog
 */
export function getSchemas(languageId: string, catalog?: string) {
	const schemas = catalog ? schemaList : tmpSchemaList;

	const schemaCompletions = schemas.map((sc) => ({
		label: prefixLabel(languageId, sc),
		kind: languages.CompletionItemKind.Field,
		detail: 'Remote: schema',
		sortText: '1' + prefixLabel(languageId, sc)
	}));

	return Promise.resolve(schemaCompletions);
}

/**
 * Get tables based on catalog and database
 */
export function getTables(languageId: string, catalog?: string, database?: string) {
	const tables = catalog && database ? tableList : tmpTableList;

	const tableCompletions = tables.map((tb) => ({
		label: prefixLabel(languageId, tb),
		kind: languages.CompletionItemKind.Field,
		detail: 'Remote: table',
		sortText: '1' + prefixLabel(languageId, tb)
	}));

	return Promise.resolve(tableCompletions);
}

/**
 * Get views based on catalog and database
 */
export function getViews(languageId: string, catalog?: string, database?: string) {
	const views = catalog && database ? viewList : tmpViewList;

	const viewCompletions = views.map((v) => ({
		label: prefixLabel(languageId, v),
		kind: languages.CompletionItemKind.Field,
		detail: 'Remote: view',
		sortText: '1' + prefixLabel(languageId, v)
	}));

	return Promise.resolve(viewCompletions);
}

/**
 * Get column information for a specific table
 * @param languageId Language ID
 * @param tableName Table name
 * @returns Column completion items
 */
export function getColumns(languageId: string, tableName: string): Promise<ICompletionItem[]> {
	// Mock column data, should fetch from cloud in real environment
	const mockColumns = [
		{ name: 'id', type: 'INT' },
		{ name: 'name', type: 'VARCHAR' },
		{ name: 'age', type: 'INT' },
		{ name: 'created_at', type: 'TIMESTAMP' },
		{ name: 'updated_at', type: 'TIMESTAMP' }
	];

	const columnCompletions = mockColumns.map((col) => ({
		label: `${col.name}(${col.type})`,
		insertText: col.name,
		kind: languages.CompletionItemKind.EnumMember,
		detail: `Remote: \`${tableName}\`'s column`,
		sortText: '0' + tableName + col.name
	}));

	return Promise.resolve(columnCompletions);
}
