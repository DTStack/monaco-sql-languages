import type { CompletionSnippetOption } from 'src/monaco.contribution';

export const flinkSnippets: CompletionSnippetOption[] = [
	{
		label: 'create-source-table',
		prefix: 'CREATE-SOURCE-TABLE',
		body: [
			'CREATE TABLE ${1:source_table} (',
			'\tid STRING,',
			'\tval BIGINT,',
			'\tts TIMESTAMP(3),',
			"\tWATERMARK FOR ts AS ts - INTERVAL '5' SECOND",
			') WITH (',
			"\t'connector' = 'kafka',",
			"\t'topic' = 'input_topic',",
			"\t'properties.bootstrap.servers' = 'localhost:9092',",
			"\t'format' = 'json',",
			"\t'scan.startup.mode' = 'earliest-offset'",
			');'
		]
	},
	{
		label: 'create-sink-table',
		prefix: 'CREATE-SINK-TABLE',
		body: [
			'CREATE TABLE ${1:sink_table} (',
			'\tid STRING,',
			'\tcnt BIGINT',
			') WITH (',
			"\t'connector' = 'jdbc',",
			"\t'url' = 'jdbc:mysql://localhost:3306/test',",
			"\t'table-name' = 'output_table',",
			"\t'username' = 'root',",
			"\t'password' = 'password'",
			');'
		]
	},
	{
		label: 'tumble-window',
		prefix: 'TUMBLE-WINDOW',
		body: [
			'SELECT',
			'\twindow_start,',
			'\twindow_end,',
			'\tSUM(price) as total_price',
			'FROM',
			'\tTABLE(TUMBLE(TABLE table_name2,',
			'\tDESCRIPTOR(create_time),',
			"\tINTERVAL '1' MINUTE))",
			'GROUP BY',
			'\twindow_start,',
			'\twindow_end;'
		]
	},
	{
		label: 'hop-window',
		prefix: 'HOP-WINDOW',
		body: [
			'SELECT',
			'\twindow_start,',
			'\twindow_end,',
			'\tSUM(price) as total_price',
			'FROM',
			'\tTABLE(HOP(TABLE table_name2,',
			'\tDESCRIPTOR(create_time),',
			"\tINTERVAL '30' SECONDS,",
			"\tINTERVAL '1' MINUTE))",
			'GROUP BY',
			'\twindow_start,',
			'\twindow_end;'
		]
	},
	{
		label: 'comulate-window',
		prefix: 'CUMULATE-WINDOW',
		body: [
			'SELECT',
			'\twindow_start,',
			'\twindow_end,',
			'\tSUM(price) as total_price',
			'FROM',
			'\tTABLE(CUMULATE(TABLE table_name2,',
			'\tDESCRIPTOR(create_time),',
			"\tINTERVAL '30' SECONDS,",
			"\tINTERVAL '1' MINUTE))",
			'GROUP BY',
			'\twindow_start,',
			'\twindow_end;'
		]
	},
	{
		label: 'session-window',
		prefix: 'SESSION-WINDOW',
		body: [
			'SELECT',
			"\tSESSION_START(create_time, INTERVAL '10' SECOND) AS session_beg,",
			"\tSESSION_ROWTIME(create_time, INTERVAL '10' SECOND) AS session_end,",
			'\tSUM(price) AS total_price',
			'FROM',
			'\ttable_name',
			'GROUP BY',
			"\tSESSION(create_time, INTERVAL '10' SECOND);"
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
	}
];
