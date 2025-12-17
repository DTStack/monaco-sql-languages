const requirejs = require('requirejs');
const jsdom = require('jsdom');
const glob = require('fast-glob');
const path = require('path');
const Mocha = require('mocha');

requirejs.config({
	baseUrl: path.join(__dirname, '../'),
	paths: {
		vs: 'node_modules/monaco-editor/dev/vs',
		'vs/css': 'test/css.mock',
		'vs/nls': 'test/nls.mock',
		'out/amd/fillers/monaco-editor-core': 'out/amd/fillers/monaco-editor-core-amd'
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
global.define = requirejs.define;

// 添加完整的DOM环境支持
global.Element = tmp.window.Element;
global.window = {
	location: {},
	navigator: tmp.window.navigator,
	matchMedia: function () {
		return {
			matches: false,
			addEventListener: function () {}
		};
	},
	setInterval: setInterval,
	clearInterval: clearInterval,
	setTimeout: setTimeout,
	clearTimeout: clearTimeout,
	document: tmp.window.document,
	Element: tmp.window.Element
};
if (!document.body) {
	const body = document.createElement('body');
	document.appendChild(body);
}

requirejs(
	['./test/setup'],
	function () {
		let files;
		try {
			files = glob.sync('out/amd/languages/*/*.test.js', {
				cwd: path.dirname(__dirname),
				dot: true
			});
		} catch (err) {
			console.log(err);
			return;
		}

		requirejs(
			files.map((f) => f.replace(/\.js$/, '')),
			function () {
				// 初始化Mocha
				const mocha = new Mocha({
					ui: 'bdd',
					reporter: 'spec',
					timeout: 5000
				});

				// 手动添加测试到Mocha的suite
				const Suite = require('mocha/lib/suite');
				const Test = require('mocha/lib/test');

				// 创建一个根suite
				const rootSuite = new Suite('Root Suite');
				mocha.suite.addSuite(rootSuite);

				// 添加存储的测试
				if (global._pendingTests && global._pendingTests.length > 0) {
					global._pendingTests.forEach(function (test) {
						const mochaTest = new Test(test.name, test.fn);
						rootSuite.addTest(mochaTest);
					});
				}

				// 运行测试
				mocha.run(function (failures) {
					process.exit(failures ? 1 : 0);
				});
			},
			function (err) {
				console.log('Error loading test files:', err);
				process.exit(1);
			}
		);
	},
	function (err) {
		console.log(err);
		process.exit(1);
	}
);
