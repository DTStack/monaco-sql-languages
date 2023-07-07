const requirejs = require('requirejs');
const jsdom = require('jsdom');
const glob = require('glob');
const path = require('path');

requirejs.config({
	baseUrl: '',
	paths: {
		'vs/css': 'test/css.mock',
		'vs/nls': 'test/nls.mock',
		'out/amd/fillers/monaco-editor-core': 'out/amd/fillers/monaco-editor-core-amd',
		vs: 'node_modules/monaco-editor/dev/vs'
	},
	nodeRequire: require
});

const tmp = new jsdom.JSDOM('<!DOCTYPE html><html><body></body></html>');
global.AMD = true;
global.document = tmp.window.document;
global.navigator = tmp.window.navigator;
global.self = global;
global.document.queryCommandSupported = function () {
	return false;
};
global.UIEvent = tmp.window.UIEvent;

global.window = {
	location: {},
	navigator: tmp.window.navigator,
	matchMedia: function () {
		return {
			matches: false,
			addEventListener: function () {}
		};
	}
};

requirejs(
	['./test/setup'],
	function () {
		glob('out/amd/*/*.test.js', { cwd: path.dirname(__dirname) }, function (err, files) {
			if (err) {
				console.log(err);
				return;
			}
			requirejs(
				files.map((f) => f.replace(/\.js$/, '')),
				function () {
					run(); // We can launch the tests!
				},
				function (err) {
					console.log(err);
				}
			);
		});
	},
	function (err) {
		console.log(err);
		process.exit(1);
	}
);
