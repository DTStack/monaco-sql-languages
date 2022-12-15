const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts'],
		alias: {},
		fallback: { fs: false }
	},
	entry: {
		app: path.resolve(__dirname, '../web/app.js'),
		'sparksql.worker': path.resolve(__dirname, '../src/sparksql/sparksql.worker.ts'),
		'flinksql.worker': path.resolve(__dirname, '../src/flinksql/flinksql.worker.ts'),
		'hivesql.worker': path.resolve(__dirname, '../src/hivesql/hivesql.worker.ts'),
		'mysql.worker': path.resolve(__dirname, '../src/mysql/mysql.worker.ts'),
		'plsql.worker': path.resolve(__dirname, '../src/plsql/plsql.worker.ts'),
		'pgsql.worker': path.resolve(__dirname, '../src/pgsql/pgsql.worker.ts'),
		'sql.worker': path.resolve(__dirname, '../src/sql/sql.worker.ts')
	},
	output: {
		globalObject: 'self',
		path: path.resolve(__dirname, '../docs'),
		chunkFilename: '[name].[contenthash].js',
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false
				}
			},
			{
				test: /\.(js|jsx|tsx|ts)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(jpg|png|gif|eot|woff|svg|ttf|woff2|gif|appcache|webp)(\?|$)/,
				type: 'asset/resource'
			}
		]
	},
	plugins: [
		new MonacoWebpackPlugin({
			languages: []
		}),
		new webpack.DefinePlugin({
			__DEVELOPMENT__: false
		}),
		new HtmlWebPackPlugin({
			template: path.resolve(__dirname, '../web/public/index.html')
		})
	]
};
