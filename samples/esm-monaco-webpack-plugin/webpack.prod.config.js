const devConfig = require('./webpack.config');

delete devConfig.devServer;
delete devConfig.devtool;

devConfig.mode = 'production';
devConfig.optimization = {
	minimize: false
};

module.exports = devConfig;
