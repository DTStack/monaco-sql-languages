const { merge } = require('webpack-merge');
const webpackConf = require('./webpack.base');

module.exports = function (env) {
	return merge(webpackConf, {
		mode: 'production'
	});
};
