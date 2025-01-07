import type { CompletionSnippetOption } from 'src/monaco.contribution';

export const trinoSnippets: CompletionSnippetOption[] = [
	{
		label: 'select',
		prefix: 'SELECT',
		body: ['SELECT ${2:column1}, ${3:column2} FROM ${1:hive.schema_name.table_name};\n$4']
	},
	{
		label: 'select-join',
		prefix: 'SELECT-JOIN',
		body: [
			'SELECT ${8:column1} FROM ${1:hive.schema_name.table_name1} ${2:t1}',
			'${3:LEFT} JOIN ${4:hive.schema_name.table_name2} ${5:t2} ON ${2:t1}.${6:column1} = ${5:t2}.${7:column2};\n$9'
		]
	},
	{
		label: 'select-order-by',
		prefix: 'SELECT-ORDER-BY',
		body: [
			'SELECT ${2:column1}, ${3:column2} FROM ${1:hive.schema_name.table_name} ORDER BY ${4:column1} ${5:desc};\n$6'
		]
	},
	{
		label: 'insert',
		prefix: 'INSERT-INTO',
		body: [
			'INSERT INTO ${1:hive.schema_name.table_name} (${2:column1}, ${3:column2}) VALUES (${4:value1}, ${5:value2});\n$6'
		]
	},
	{
		label: 'insert-into-select',
		prefix: 'INSERT-INTO-SELECT',
		body: [
			'INSERT INTO ${1:hive.schema_name.table_name}',
			'SELECT ${2:column1}, ${3:column2}',
			'FROM ${4:source_table}',
			'WHERE ${5:conditions};\n$6'
		]
	},
	{
		label: 'update',
		prefix: 'UPDATE',
		body: [
			'UPDATE ${1:hive.schema_name.table_name}',
			'SET ${2:column1} = ${3:value1}',
			'WHERE ${4:column2} = ${5:value2};\n$6'
		]
	},
	{
		label: 'delete',
		prefix: 'DELETE',
		body: [
			'DELETE FROM ${1:hive.schema_name.table_name}',
			'WHERE ${2:column1} = ${3:value1};\n$4'
		]
	},
	{
		label: 'create-catalog',
		prefix: 'CREATE-CATALOG',
		body: [
			'CREATE CATALOG ${1:catalog_name} USING ${2:hive}',
			'WITH (',
			"\t${3:property_name} = '${4:property_value}'",
			');\n$5'
		]
	},
	{
		label: 'create-schema',
		prefix: 'CREATE-SCHEMA',
		body: ["CREATE SCHEMA ${1:hive.schema_name} WITH (LOCATION = '${2:/hive/data/web}');\n$3"]
	},
	{
		label: 'create-table',
		prefix: 'CREATE-TABLE',
		body: [
			'CREATE TABLE IF NOT EXISTS ${1:hive.schema_name.table_name} (',
			'\t${2:column1} ${3:STRING},',
			'\t${4:column2} ${5:STRING}',
			')',
			"COMMENT '${6:table_comment}'",
			'WITH (',
			"\tformat = '${7:PARQUET}'",
			');\n$8'
		]
	},
	{
		label: 'create-table-as-select',
		prefix: 'CREATE-TABLE-AS-SELECT',
		body: [
			'CREATE TABLE IF NOT EXISTS ${1:hive.schema_name.table_name}',
			'AS',
			'SELECT ${3:column1}, ${4:column2}',
			'FROM ${2:source_table}',
			'WHERE ${5:conditions};\n$6'
		]
	},
	{
		label: 'alter-table-properties',
		prefix: 'ALTER-TABLE-PROPERTIES',
		body: [
			"ALTER TABLE ${1:hive.schema_name.table_name} SET PROPERTIES ${2:property_name} = '${3:property_value}';\n$4"
		]
	},
	{
		label: 'alter-table-columns',
		prefix: 'ALTER-TABLE-COLUMNS',
		body: [
			"ALTER TABLE ${1:hive.schema_name.table_name} ADD COLUMN ${2:column_name} ${3:STRING} COMMENT '${4:desc}';\n$5"
		]
	}
];
