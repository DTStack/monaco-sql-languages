const { merge } = require('webpack-merge');
const webpackConf = require('./webpack.base');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function (env) {
	return merge(webpackConf, {
		mode: 'development',
		devtool: 'inline-source-map',
		devServer: {
			hot: true,
			port: 8080
		},
		plugins: [
			new BundleAnalyzerPlugin({
				analyzerPort: 3001
			})
		].filter(Boolean)
	});
};
