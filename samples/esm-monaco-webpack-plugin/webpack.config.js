const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
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
		new webpack.DefinePlugin({
			/**
			 * Don't define the entire Process.env! This time it will cause weird problems in this project.
			 * Just define process.env.NODE_DEBUG, and everything works well!
			 */
			'process.env.NODE_DEBUG': process.env.NODE_DEBUG
		}),
		new MonacoWebpackPlugin({
			features: [],
			languages: [],
			customLanguages: [
				{
					label: 'flinksql',
					entry: 'monaco-sql-languages/out/esm/flinksql/flinksql.contribution',
					worker: {
						id: 'monaco-sql-languages/out/esm/flinksql/flinkSQLWorker',
						entry: 'monaco-sql-languages/out/esm/flinksql/flinksql.worker'
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
