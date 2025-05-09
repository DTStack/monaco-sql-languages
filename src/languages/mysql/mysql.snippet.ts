import type { CompletionSnippetOption } from 'src/monaco.contribution';

export const mysqlSnippets: CompletionSnippetOption[] = [
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
			'SELECT ${3:column1}, ${4:column2}',
			'FROM ${2:source_table}',
			'WHERE ${5:conditions};\n$6'
		]
	},
	{
		label: 'replace-into-table',
		prefix: 'REPLACE-INTO-TABLE',
		body: [
			'REPLACE INTO ${1:table_name} (${2:column1}, ${3:column2})',
			'VALUES (${4:value1}, ${5:value2});\n$6'
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
			'CREATE TABLE ${1:table_name} (',
			'\t${2:column1} ${3:INT},',
			'\t${4:column2} ${5:INT},',
			'\tPRIMARY KEY (${2:column1})',
			')',
			"COMMENT '${6:table_comment}';\n$7"
		]
	},
	{
		label: 'create-table-as-select',
		prefix: 'CREATE-TABLE-AS-SELECT',
		body: [
			'CREATE TABLE ${1:table_name}',
			'AS',
			'SELECT ${2:column1}, ${3:column2}',
			'FROM ${4:source_table}',
			'WHERE ${5:conditions};\n$6'
		]
	},
	{
		label: 'create-table-partitioned-by-range',
		prefix: 'CREATE-TABLE-PARTITIONED-BY-RANGE',
		body: [
			'CREATE TABLE ${1:table_name} (',
			'\t${2:column1} ${3:INT},',
			'\t${4:column2} ${5:INT},',
			'\tPRIMARY KEY (${2:column1})',
			')',
			'PARTITION BY RANGE (${2:column1}) (',
			'\tPARTITION ${6:p0} VALUES LESS THAN ($7)',
			');\n$8'
		]
	},
	{
		label: 'create-table-partitioned-by-list',
		prefix: 'CREATE-TABLE-PARTITIONED-BY-LIST',
		body: [
			'CREATE TABLE ${1:table_name} (',
			'\t${2:column1} ${3:INT},',
			'\t${4:column2} ${5:INT},',
			'\tPRIMARY KEY (${2:column1})',
			')',
			'PARTITION BY LIST (${2:column1}) (',
			'\tPARTITION ${6:p0} VALUES IN ($7)',
			');\n$8'
		]
	},
	{
		label: 'create-table-partitioned-by-hash',
		prefix: 'CREATE-TABLE-PARTITIONED-BY-HASH',
		body: [
			'CREATE TABLE ${1:table_name} (',
			'\t${2:column1} ${3:INT},',
			'\t${4:column2} ${5:INT},',
			'\tPRIMARY KEY (${2:column1})',
			')',
			'PARTITION BY HASH (${2:column1})',
			'PARTITIONS ${6:4};\n$7'
		]
	},
	{
		label: 'create-table-partitioned-by-key',
		prefix: 'CREATE-TABLE-PARTITIONED-BY-KEY',
		body: [
			'CREATE TABLE ${1:table_name} (',
			'\t${2:column1} ${3:INT},',
			'\t${4:column2} ${5:INT},',
			'\tPRIMARY KEY (${2:column1})',
			')',
			'PARTITION BY KEY (${2:column1})',
			'PARTITIONS ${6:4};\n$7'
		]
	},
	{
		label: 'alter-table-add-column',
		prefix: 'ALTER-TABLE-ADD-COLUMN',
		body: ["ALTER TABLE ${1:table_name} ADD ${2:column_name} ${3:INT} COMMENT '${4:desc}';\n$5"]
	},
	{
		label: 'alter-table-add-partition',
		prefix: 'ALTER-TABLE-ADD-PARTITION',
		body: ['ALTER TABLE ${1:table_name} ADD PARTITION (', '\t$2', ');\n$4']
	},
	{
		label: 'alter-table-add-index',
		prefix: 'ALTER-TABLE-ADD-INDEX',
		body: ['ALTER TABLE ${1:table_name} ADD INDEX ${2:index_name} (${3:column_name});\n$4']
	},
	{
		label: 'alter-table-add-primary-key',
		prefix: 'ALTER-TABLE-ADD-PRIMARY-KEY',
		body: ['ALTER TABLE ${1:table_name} ADD PRIMARY KEY (${2:column_name});\n$3']
	},
	{
		label: 'alter-table-add-constraint',
		prefix: 'ALTER-TABLE-ADD-CONSTRAINT',
		body: [
			'ALTER TABLE ${1:table_name}',
			'ADD CONSTRAINT ${2:constraint_name}',
			'FOREIGN KEY (${3:foreign_column}) REFERENCES ${4:ref_table} (${5:ref_column});\n$6'
		]
	}
];
