const path = require('path');
const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts'],
		alias: {
			mo: path.resolve(__dirname, '../node_modules/molecule/esm')
		},
		fallback: { fs: false }
	},
	entry: {
		app: path.resolve(__dirname, '../web/app.js'),
		'sparksql.worker': path.resolve(__dirname, '../src/sparksql/sparksql.worker.ts'),
		'flinksql.worker': path.resolve(__dirname, '../src/flinksql/flinksql.worker.ts')
	},
	output: {
		globalObject: 'self',
		path: path.resolve(__dirname, '../public')
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
			languages: ['html', 'typescript', 'javascript', 'css']
		}),
		new webpack.DefinePlugin({
			__DEVELOPMENT__: true
		}),
		new HtmlWebPackPlugin({
			template: path.resolve(__dirname, '../web/public/index.html')
		})
	]
};
