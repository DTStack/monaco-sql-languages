const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: {
		index: path.resolve(__dirname, './src/index.ts'),
		// output worker file as entries
		'mysql.worker': 'monaco-sql-languages/esm/languages/mysql/mysql.worker.js',
		'flink.worker': 'monaco-sql-languages/esm/languages/flink/flink.worker.js',
		'spark.worker': 'monaco-sql-languages/esm/languages/spark/spark.worker.js',
		'hive.worker': 'monaco-sql-languages/esm/languages/hive/hive.worker.js',
		'trino.worker': 'monaco-sql-languages/esm/languages/trino/trino.worker.js',
		'pgsql.worker': 'monaco-sql-languages/esm/languages/pgsql/pgsql.worker.js',
		'impala.worker': 'monaco-sql-languages/esm/languages/impala/impala.worker.js',
		'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js'
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
		})
	],
	devServer: {
		hot: true,
		host: '0.0.0.0',
		port: 8080
	}
};
