import type { CompletionSnippetOption } from 'src/monaco.contribution';

export const sparkSnippets: CompletionSnippetOption[] = [
	{
		label: 'select',
		prefix: 'SELECT',
		body: ['SELECT ${2:column1}, ${3:column2} FROM ${1:table_name};\n$4']
	},
	{
		label: 'select-join',
		prefix: 'SELECT-JOIN',
		body: [
			'SELECT ${8:column1} FROM ${1:table_name} ${2:t1}',
			'${3:LEFT} JOIN ${4:table2} ${5:t2} ON ${2:t1}.${6:column1} = ${5:t2}.${7:column2};\n$9'
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
		label: 'insert',
		prefix: 'INSERT-INTO',
		body: [
			'INSERT INTO ${1:table_name} (${2:column1}, ${3:column2}) VALUES (${4:value1}, ${5:value2});\n$6'
		]
	},
	{
		label: 'insert-into-select',
		prefix: 'INSERT-INTO-SELECT',
		body: [
			'INSERT INTO ${1:table_name}',
			'SELECT ${2:column1}, ${3:column2}',
			'FROM ${4:source_table}',
			'WHERE ${5:conditions};\n$6'
		]
	},
	{
		label: 'insert-overwrite-table',
		prefix: 'INSERT-OVERWRITE-TABLE',
		body: [
			'INSERT OVERWRITE TABLE ${1:table_name}',
			'SELECT ${3:column1}, ${4:column2}',
			'FROM ${2:source_table}',
			'WHERE ${5:conditions};\n$6'
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
			'\t${2:column1} ${3:STRING},',
			'\t${4:column2} ${5:STRING}',
			')',
			'USING ${6:parquet}',
			"COMMENT '${7:table_comment}';\n$8"
		]
	},
	{
		label: 'create-table-as-select',
		prefix: 'CREATE-TABLE-AS-SELECT',
		body: [
			'CREATE TABLE IF NOT EXISTS ${1:table_name}',
			'AS',
			'SELECT ${2:column1}, ${3:column2}',
			'FROM ${4:source_table}',
			'WHERE ${5:conditions};\n$6'
		]
	},
	{
		label: 'create-partition-table',
		prefix: 'CREATE-PARTITION-TABLE',
		body: [
			'CREATE TABLE IF NOT EXISTS ${1:table_name} (',
			'\t${2:column1} ${3:STRING},',
			'\t${4:column2} ${5:STRING}',
			')',
			'USING ${6:parquet}',
			'PARTITIONED BY (${7:part_column_name} ${8:STRING})',
			"COMMENT '${9:table_comment}';\n$10"
		]
	},
	{
		label: 'create-bucket-table',
		prefix: 'CREATE-BUCKET-TABLE',
		body: [
			'CREATE TABLE IF NOT EXISTS ${1:table_name} (',
			'\t${2:column1} ${3:STRING},',
			'\t${4:column2} ${5:STRING}',
			')',
			'USING ${6:parquet}',
			'CLUSTERED BY (${7:bucket_column}) INTO ${8:1} BUCKETS',
			"COMMENT '${9:table_comment}';\n$10"
		]
	},
	{
		label: 'alter-table-partition',
		prefix: 'ALTER-TABLE-PARTITION',
		body: [
			"ALTER TABLE ${1:table_name} ${2:ADD} PARTITION (${3:part_column}='${4:part_value}');\n$5"
		]
	},
	{
		label: 'alter-table-properties',
		prefix: 'ALTER-TABLE-PROPERTIES',
		body: [
			"ALTER TABLE ${1:table_name} SET TBLPROPERTIES ('${2:property_name}'='${3:property_value}');\n$4"
		]
	},
	{
		label: 'alter-table-column',
		prefix: 'ALTER-TABLE-COLUMN',
		body: [
			"ALTER TABLE ${1:table_name} ADD COLUMN ${2:column_name} ${3:STRING} COMMENT '${4:desc}';\n$5"
		]
	}
];
