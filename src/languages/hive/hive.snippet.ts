import type { CompletionSnippetOption } from 'src/monaco.contribution';

export const hiveSnippets: CompletionSnippetOption[] = [
	{
		label: 'select',
		prefix: 'SELECT',
		body: ['SELECT ${2:column1}, ${3:column2} FROM ${1:table_name};\n$4']
	},
	{
		label: 'select join',
		prefix: 'SELECT-JOIN',
		body: [
			'SELECT ${8:column1} FROM ${1:table_name} ${2:t1}',
			'${3:LEFT} JOIN ${4:table2} ${5:t2} ON ${2:t1}.${6:column1} = ${5:t2}.${7:column2};\n$9'
		]
	},
	{
		label: 'select order-by',
		prefix: 'SELECT-ORDERBY',
		body: [
			'SELECT ${2:column1}, ${3:column2} FROM ${1:table_name} ORDER BY ${4:column1} ${5:desc};\n$6'
		]
	},
	{
		label: 'insert',
		prefix: 'INSERT',
		body: [
			'INSERT INTO ${1:table_name} (${2:column1}, ${3:column2}) VALUES (${4:value1}, ${5:value2});\n$6'
		]
	},
	{
		label: 'insert into select',
		prefix: 'INSERT',
		body: [
			'INSERT INTO TABLE ${1:table_name}',
			'SELECT ${2:column1}, ${3:column3}',
			'FROM ${4:source_table}',
			'WHERE ${5:conditions};\n$6'
		]
	},
	{
		label: 'update',
		prefix: 'UPDATE',
		body: [
			'UPDATE ${1:table_name} SET ${2:column1} = ${3:value1} WHERE ${4:column2} = ${5:value2};\n$6'
		]
	},
	{
		label: 'delete',
		prefix: 'DELETE',
		body: ['DELETE FROM ${1:table_name} WHERE ${2:column1} = ${3:value1};\n$4']
	},
	{
		label: 'create table',
		prefix: 'CREATE-TABLE',
		body: [
			'CREATE TABLE IF NOT EXISTS ${1:table_name} (',
			'\t${2:column1} ${3:STRING},',
			'\t${4:column2} ${5:STRING}',
			')',
			"COMMENT '${6:table_alias}'",
			'ROW FORMAT ${7:DELIMITE}',
			"FIELDS TERMINATED BY '${8:\\t}'",
			'STORED AS ${9:TEXTFILE};\n$10'
		]
	},
	{
		label: 'create table as select',
		prefix: 'CREATE-TABLE-AS-SELECT',
		body: [
			'CREATE TABLE ${1:table_name} AS',
			'SELECT ${2:column1}, ${3:column2}',
			'FROM ${4:source_table}',
			'WHERE ${5:conditions};\n$6'
		]
	},
	{
		label: 'create partition table',
		prefix: 'CREATE-PARTITION-TABLE',
		body: [
			'CREATE TABLE IF NOT EXISTS ${1:table_name} (',
			'\t${2:column1} ${3:STRING},',
			'\t${4:column2} ${5:STRING}',
			')',
			"COMMENT '${6:table_alias}'",
			'PARTITIONED BY (${7:part_column_name} STRING)',
			'ROW FORMAT ${8:DELIMITED}',
			"FIELDS TERMINATED BY '${9:\\t}'",
			'STORED AS ${10:TEXTFILE};\n$11'
		]
	},
	{
		label: 'create bucket table',
		prefix: 'CREATE-BUCKET-TABLE',
		body: [
			'CREATE TABLE IF NOT EXISTS ${1:table_name} (',
			'\t${2:column1} ${3:STRING},',
			'\t${4:column2} ${5:STRING}',
			')',
			"COMMENT '${6:table_alias}'",
			'PARTITIONED BY (${7:part_column_name} STRING)',
			'CLUSTERED BY (${8:bucket_column_name})',
			'INTO ${9:1} BUCKETS',
			'ROW FORMAT ${10:DELIMITED}',
			"FIELDS TERMINATED BY '${11:\\t}'",
			'STORED AS ${12:TEXTFILE};\n$13'
		]
	},
	{
		label: 'alter table partition',
		prefix: 'ALTER-TABLE-PARTITION',
		body: [
			'ALTER TABLE ${1:table_name}',
			"${2:ADD} PARTITION (${3:partition_column}='${4:partition_value}');\n$5"
		]
	}
];
