const TerserPlugin = require('terser-webpack-plugin');
const devConfig = require('./webpack.config');

delete devConfig.devServer;
delete devConfig.devtool;

devConfig.mode = 'production';
devConfig.optimization = {
	minimize: true,
	minimizer: [new TerserPlugin()]
};

module.exports = devConfig;
