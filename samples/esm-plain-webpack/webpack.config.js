const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: {
		index: path.resolve(__dirname, './src/index.ts'),
		// output worker file as entries
		'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
		'flinksql.worker': 'monaco-sql-languages/out/esm/flinksql/flinksql.worker.js'
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
