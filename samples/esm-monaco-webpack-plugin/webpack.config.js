const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: {
		index: path.resolve(__dirname, './src/index.ts')
	},
	output: {
		path: path.resolve(__dirname, './dist')
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?/,
				loader: 'ts-loader'
			},
			{
				test: /\.css/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './index.html')
		}),
		new MonacoWebpackPlugin({
			features: [],
			languages: [],
			customLanguages: [
				// 包含 Monaco SQL Languages 所提供的语言功能
				{
					label: 'mysql',
					entry: 'monaco-sql-languages/esm/languages/mysql/mysql.contribution',
					worker: {
						id: '/esm/languages/mysql/',
						entry: 'monaco-sql-languages/esm/languages/mysql/mysql.worker'
					}
				},
				{
					label: 'flinksql',
					entry: 'monaco-sql-languages/esm/languages/flink/flink.contribution',
					worker: {
						id: '/esm/languages/flink/',
						entry: 'monaco-sql-languages/esm/languages/flink/flink.worker'
					}
				},
				{
					label: 'sparksql',
					entry: 'monaco-sql-languages/esm/languages/spark/spark.contribution',
					worker: {
						id: '/esm/languages/spark/',
						entry: 'monaco-sql-languages/esm/languages/spark/spark.worker'
					}
				},
				{
					label: 'hivesql',
					entry: 'monaco-sql-languages/esm/languages/hive/hive.contribution',
					worker: {
						id: '/esm/languages/hive/',
						entry: 'monaco-sql-languages/esm/languages/hive/hive.worker'
					}
				},
				{
					label: 'trinosql',
					entry: 'monaco-sql-languages/esm/languages/trino/trino.contribution',
					worker: {
						id: '/esm/languages/trino/',
						entry: 'monaco-sql-languages/esm/languages/trino/trino.worker'
					}
				},
				{
					label: 'pgsql',
					entry: 'monaco-sql-languages/esm/languages/pgsql/pgsql.contribution',
					worker: {
						id: '/esm/languages/pgsql/',
						entry: 'monaco-sql-languages/esm/languages/pgsql/pgsql.worker'
					}
				},
				{
					label: 'impalasql',
					entry: 'monaco-sql-languages/esm/languages/impala/impala.contribution',
					worker: {
						id: '/esm/languages/impala/',
						entry: 'monaco-sql-languages/esm/languages/impala/impala.worker'
					}
				}
			]
		})
	],
	devServer: {
		hot: true,
		host: '0.0.0.0',
		port: 8081
	}
};
