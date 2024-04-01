const devConfig = require('./webpack.config');

delete devConfig.devServer;
delete devConfig.devtool;

devConfig.mode = 'production';

module.exports = devConfig;
