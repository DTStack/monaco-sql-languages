import type { CompletionSnippetOption } from 'src/monaco.contribution';

export const genericSnippets: CompletionSnippetOption[] = [
	{
		label: 'select',
		prefix: 'SELECT',
		body: ['SELECT ${2:column1}, ${3:column2} FROM ${1:table_name};\n$4']
	},
	{
		label: 'select-join',
		prefix: 'SELECT-JOIN',
		body: [
			'SELECT ${8:column1} FROM ${1:table_name1} ${2:t1}',
			'${3:LEFT} JOIN ${4:table_name2} ${5:t2} ON ${2:t1}.${6:column1} = ${5:t2}.${7:column2};\n$9'
		]
	},
	{
		label: 'select-order-by',
		prefix: 'SELECT-ORDER-BY',
		body: [
			'SELECT ${2:column1}, ${3:column2} FROM ${1:table_name} ORDER BY ${4:column1} ${5:desc};\n$6'
		]
	},
	{
		label: 'select-group-by',
		prefix: 'SELECT-GROUP-BY',
		body: ['SELECT ${2:column1}, COUNT(*) FROM ${1:table_name} GROUP BY ${2:column1};\n$3']
	},
	{
		label: 'insert',
		prefix: 'INSERT-INTO',
		body: [
			'INSERT INTO ${1:table_name} (${2:column1}, ${3:column2})',
			'SELECT ${4:column1}, ${5:column2} FROM ${6:source_table};\n$7'
		]
	},
	{
		label: 'update',
		prefix: 'UPDATE',
		body: [
			'UPDATE ${1:table_name}',
			'SET ${2:column1} = ${3:value1}',
			'WHERE ${4:column2} = ${5:value2};\n$6'
		]
	},
	{
		label: 'delete',
		prefix: 'DELETE',
		body: ['DELETE FROM ${1:table_name}', 'WHERE ${2:column1} = ${3:value1};\n$4']
	},
	{
		label: 'create-table',
		prefix: 'CREATE-TABLE',
		body: [
			'CREATE TABLE IF NOT EXISTS ${1:table_name} (',
			'\t${2:column1} ${3:INT} PRIMARY KEY,',
			'\t${4:column2} ${5:VARCHAR(100)} NOT NULL',
			');\n$6'
		]
	},
	{
		label: 'alter-table-add',
		prefix: 'ALTER-TABLE-ADD',
		body: ['ALTER TABLE ${1:table_name} ADD COLUMN ${2:column_name} ${3:INT};\n$4']
	},
	{
		label: 'alter-table-drop',
		prefix: 'ALTER-TABLE-DROP',
		body: ['ALTER TABLE ${1:table_name} DROP COLUMN ${2:column_name};\n$3']
	},
	{
		label: 'drop-table',
		prefix: 'DROP-TABLE',
		body: ['DROP TABLE IF EXISTS ${1:table_name};\n$2']
	}
];
