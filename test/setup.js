define('vs/css', [], {
	load: function (name, req, load) {
		load({});
	}
});

define('vs/nls', [], {
	create: function () {
		return {
			localize: function () {
				return 'NO_LOCALIZATION_FOR_YOU';
			},
			localize2: function () {
				return 'NO_LOCALIZATION_FOR_YOU';
			},
			getConfiguredDefaultLocale: function () {
				return undefined;
			}
		};
	},
	localize: function () {
		return 'NO_LOCALIZATION_FOR_YOU';
	},
	localize2: function (key, message) {
		return { value: 'NO_LOCALIZATION_FOR_YOU', original: message };
	},
	load: function (name, req, load) {
		load({});
	}
});

define(['vs/editor/editor.main'], function (api) {
	global.monaco = api;
});

// 定义Mocha全局函数
global.test = function (name, fn) {
	// 检查函数是否返回Promise（包括编译后的异步函数）
	const isPromiseFunction =
		fn &&
		typeof fn === 'function' &&
		((fn.constructor && fn.constructor.name === 'AsyncFunction') ||
			fn.toString().includes('__awaiter') ||
			fn.toString().includes('__generator') ||
			fn.toString().includes('Promise'));

	if (isPromiseFunction) {
		// 异步函数需要包装为Mocha能理解的格式
		const wrappedFn = function (done) {
			const result = fn();
			if (result && typeof result.then === 'function') {
				result
					.then(() => {
						if (done) done();
					})
					.catch((err) => {
						if (done) done(err);
					});
			} else {
				if (done) done();
			}
		};
		global._pendingTests = global._pendingTests || [];
		global._pendingTests.push({ name, fn: wrappedFn });
	} else {
		global._pendingTests = global._pendingTests || [];
		global._pendingTests.push({ name, fn });
	}
};

global.describe =
	global.describe ||
	function (name, fn) {
		global._pendingSuites = global._pendingSuites || [];
		global._pendingSuites.push({ name, fn });
	};

global.it =
	global.it ||
	function (name, fn) {
		global._pendingTests = global._pendingTests || [];
		global._pendingTests.push({ name, fn });
	};
