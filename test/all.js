const requirejs = require('requirejs');
const jsdom = require('jsdom');
const glob = require('fast-glob');
const path = require('path');
const Mocha = require('mocha');
const nodeCrypto = require('crypto');

// Monaco Editor 0.54.0+ requires crypto for generating unique IDs
if (!globalThis.crypto) {
	globalThis.crypto = {
		randomUUID: () => nodeCrypto.randomUUID(),
		getRandomValues: (arr) => nodeCrypto.getRandomValues(arr)
	};
}
global.crypto = globalThis.crypto;

// Set up DOM environment BEFORE any AMD module loading
const tmp = new jsdom.JSDOM('<!DOCTYPE html><html><body></body></html>');
global.AMD = true;
global.document = tmp.window.document;
global.navigator = tmp.window.navigator;
global.self = global;
global.UIEvent = tmp.window.UIEvent;
global.Element = tmp.window.Element;
global.CSS = {
	supports: function () {
		return false;
	},
	escape: function (value) {
		return String(value).replace(/[^a-zA-Z0-9_\-]/g, function (ch) {
			return '\\' + ch;
		});
	}
};
global.document.queryCommandSupported = function () {
	return false;
};

// Monaco Editor 0.54.0+ uses document.baseURI for worker URLs
if (!document.baseURI) {
	Object.defineProperty(document, 'baseURI', {
		get: () => 'file://' + process.cwd() + '/',
		configurable: true
	});
}

// Mock URL constructor for Node.js environment
const OriginalURL = globalThis.URL;
class MockURL {
	constructor(url, base) {
		if (typeof url === 'string' && url.startsWith('/')) {
			this.href = url;
			return;
		}
		try {
			const instance = new OriginalURL(url, base);
			this.href = instance.href;
		} catch {
			this.href = url;
		}
	}
}
global.URL = MockURL;

global.window = {
	location: {},
	navigator: tmp.window.navigator,
	matchMedia: function () {
		return {
			matches: false,
			addEventListener: function () {}
		};
	},
	addEventListener: function () {},
	removeEventListener: function () {},
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

global.define = requirejs.define;

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
