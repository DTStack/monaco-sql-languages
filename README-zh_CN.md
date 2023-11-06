# Monaco SQL Languages

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-img]][download-url]

[npm-image]: https://img.shields.io/npm/v/monaco-sql-languages.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/monaco-sql-languages
[download-img]: https://img.shields.io/npm/dm/monaco-sql-languages.svg?style=flat
[download-url]: https://www.npmjs.com/package/monaco-sql-languages

[English](./README.md) | 简体中文

Monaco SQL Languages 是一个基于 Monaco Editor 的 SQL 语言项目，从 [monaco-languages](https://github.com/microsoft/monaco-languages) fork 而来。

不同的是，Monaco SQL Languages 集成了各种大数据领域的 SQL 语言功能，比如 FLinkSQL, SparkSQL, HiveSQL 等等。另外，Monaco SQL Languages 还通过集成 [dt-sql-parser](https://github.com/DTStack/dt-sql-parser) 提供了**SQL 语法校验** 和 **自动补全功能**。

在线预览: <https://dtstack.github.io/monaco-sql-languages/>

## 已支持的 SQL 语言类型

-   MySQL
-   FLinkSQL
-   SparkSQL
-   HiveSQL
-   TrinoSQL (PrestoSQL)
-   PostgreSQL
-   PL/SQL

**自动补全功能支持**

| SQL 类型    | 语言 ID     | 自动补全功能      |
| ---------- | ----------- | --------------- |
| MySQL      | mysql       | WIP             |
| Flink SQL  | flinksql    | ✅              |
| Spark SQL  | sparksql    | ✅              |
| Hive SQL   | hivesql     | ✅              |
| Trino SQL  | trinosql    | ✅              |
| PostgreSQL | pgsql       | WIP             |
| PL/SQL     | plsql       | WIP             |

<br/>

## 安装

```shell
npm install monaco-sql-languages
```

> 提示: 您的 Monaco Editor 版本必须是 0.31.0, 目前 Monaco SQL Languages 仅保证在 `monaco-editor@0.31.0` 上稳定运行。

<br/>

## 集成

-   [集成 ESM 版本](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md)
-   [集成 AMD 版本](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-amd.md#integrating-the-amd-version-of-the-monaco-editor)

### 使用 Monaco Editor WebPack Plugin

-   安装 Monaco Editor Webpack Plugin

    ```shell
    npm install monaco-editor-webpack-plugin
    ```

-   在 Webpack 配置中应用 Monaco Editor Webpack Plugin

    ```typescript
    const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
    const path = require('path');

    const monacoWebpackPlugin = new MonacoWebpackPlugin({
    	features: [], // 包含您所需要的 Monaco Editor 功能
    	languages: [], // 包含你所需要的 Monaco Editor 内置语言功能
    	customLanguages: [
    		// 包含 Monaco SQL Languages 所提供的语言功能
    		{
    			label: 'mysql',
    			entry: 'monaco-sql-languages/out/esm/mysql/mysql.contribution',
    			worker: {
    				id: 'monaco-sql-languages/out/esm/mysql/mySQLWorker',
    				entry: 'monaco-sql-languages/out/esm/mysql/mysql.worker'
    			}
    		},
    		{
    			label: 'flinksql',
    			entry: 'monaco-sql-languages/out/esm/flinksql/flinksql.contribution',
    			worker: {
    				id: 'monaco-sql-languages/out/esm/flinksql/flinkSQLWorker',
    				entry: 'monaco-sql-languages/out/esm/flinksql/flinksql.worker'
    			}
    		},
    		{
    			label: 'sparksql',
    			entry: 'monaco-sql-languages/out/esm/sparksql/sparksql.contribution',
    			worker: {
    				id: 'monaco-sql-languages/out/esm/sparksql/sparkSQLWorker',
    				entry: 'monaco-sql-languages/out/esm/sparksql/sparksql.worker'
    			}
    		},
    		{
    			label: 'hivesql',
    			entry: 'monaco-sql-languages/out/esm/hivesql/hivesql.contribution',
    			worker: {
    				id: 'monaco-sql-languages/out/esm/hivesql/hiveSQLWorker',
    				entry: 'monaco-sql-languages/out/esm/hivesql/hivesql.worker'
    			}
    		},
    		{
    			label: 'trinosql',
    			entry: 'monaco-sql-languages/out/esm/trinosql/trinosql.contribution',
    			worker: {
    				id: 'monaco-sql-languages/out/esm/trinosql/TrinoSQLWorker',
    				entry: 'monaco-sql-languages/out/esm/trinosql/trinosql.worker'
    			}
    		},
    		{
    			label: 'pgsql',
    			entry: 'monaco-sql-languages/out/esm/pgsql/pgsql.contribution',
    			worker: {
    				id: 'monaco-sql-languages/out/esm/pgsql/PgSQLWorker',
    				entry: 'monaco-sql-languages/out/esm/pgsql/pgsql.worker'
    			}
    		},
    		{
    			label: 'plsql',
    			entry: 'monaco-sql-languages/out/esm/plsql/plsql.contribution',
    			worker: {
    				id: 'monaco-sql-languages/out/esm/plsql/plSQLWorker',
    				entry: 'monaco-sql-languages/out/esm/plsql/plsql.worker'
    			}
    		}
    	]
    });

    module.exports = {
    	entry: './index.js',
    	output: {
    		path: path.resolve(__dirname, 'dist'),
    		filename: 'app.js'
    	},
    	module: {},
    	plugins: [monacoEditorPlugin] // 应用 monacoEditorPlugin
    };
    ```

更多 Monaco Editor Webpack Plugin 的选项, 看[这里](https://github.com/microsoft/monaco-editor/tree/main/webpack-plugin#options).

### 普通方式使用 Webpack

以 webpack entry 的方式输出 worker 文件

```typescript
entry: {
	'mysql.worker': 'monaco-sql-languages/out/esm/mysql/mysql.worker.js',
	'flinksql.worker': 'monaco-sql-languages/out/esm/flinksql/flinksql.worker.js',
	'sparksql.worker': 'monaco-sql-languages/out/esm/sparksql/sparksql.worker.js',
	'hivesql.worker': 'monaco-sql-languages/out/esm/hivesql/hivesql.worker.js',
	'trinosql.worker': 'monaco-sql-languages/out/esm/trinosql/trinosql.worker.js',
	'pgsql.worker': 'monaco-sql-languages/out/esm/pgsql/pgsql.worker.js',
	'plsql.worker': 'monaco-sql-languages/out/esm/plsql/plsql.worker.js',
	'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
},
```

定义全局变量 `MonacoEnvironment` 并指定 worker 文件的路径

```typescript
window.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		switch (label) {
			case 'mysql': {
				return './mysql.worker.js';
			}
			case 'sparksql': {
				return './sparksql.worker.js';
			}
			case 'flinksql': {
				return './flinksql.worker.js';
			}
			case 'hivesql': {
				return './hivesql.worker.js';
			}
			case 'trinosql': {
				return './trinosql.worker.js';
			}
			case 'pgsql': {
				return './pgsql.worker.js';
			}
			case 'plsql': {
				return './plsql.worker.js';
			}
			default: {
				return './editor.worker.js';
			}
		}
	}
};
```

### 使用 Vite

Vite 使用示例看 <https://github.com/DTStack/monaco-sql-languages/blob/main/website/src/languageWorker.ts>

<br/>

## 使用

1. **导入 language contributions 文件**

    ```typescript
    // 暂不支持自动补全功能的语言，直接导入对应的 contribution 文件
    import 'monaco-sql-languages/out/esm/mysql/mysql.contribution';
    import 'monaco-sql-languages/out/esm/plsql/plsql.contribution';
    import 'monaco-sql-languages/out/esm/pgsql/pgsql.contribution';
    import 'monaco-sql-languages/out/esm/sql/sql.contribution';

    // 支持自定补全功能的语言，先导入对应语言的注册方法
    import {
    	registerHiveSQLLanguage,
    	registerFlinkSQLLanguage,
    	registerSparkSQLLanguage,
    	registerTrinoSQLLanguage
    } from 'monaco-sql-languages';

    // 注册语言， completionService 是非必要的。
    registerFlinkSQLLanguage();
    registerHiveSQLLanguage();
    registerSparkSQLLanguage();
    registerTrinoSQLLanguage();

    // 或者你可以通过下面的方式一次性导入所有的语言功能
    // import 'monaco-sql-languages/out/esm/monaco.contribution';
    ```

2. **创建 completionService（非必要）**

    默认情况下，自动补全项中只包含关键字, 但是你可以通过 `completionService` 自定义自动补全项.

    ```typescript
    import { languages } from 'monaco-editor/esm/vs/editor/editor.api';
    import { CompletionService, ICompletionItem, SyntaxContextType } from 'monaco-sql-languages';

    import { languages } from 'monaco-editor/esm/vs/editor/editor.api';
    import { CompletionService, ICompletionItem, SyntaxContextType } from 'monaco-sql-languages';

    const completionService: CompletionService = function (
    	model,
    	position,
    	completionContext,
    	suggestions
    ) {
    	return new Promise((resolve, reject) => {
    		if (!suggestions) {
    			return Promise.resolve([]);
    		}
    		const { keywords, syntax } = suggestions;
    		const keywordsCompletionItems: ICompletionItem[] = keywords.map((kw) => ({
    			label: kw,
    			kind: languages.CompletionItemKind.Keyword,
    			detail: 'keyword',
    			sortText: '2' + kw
    		}));

    		let syntaxCompletionItems: ICompletionItem[] = [];

    		syntax.forEach((item) => {
    			if (item.syntaxContextType === SyntaxContextType.DATABASE) {
    				const databaseCompletions: ICompletionItem[] = [...]; // 一些数据库名自动补全项
    				syntaxCompletionItems = [...syntaxCompletionItems, ...databaseCompletions];
    			}
    			if (item.syntaxContextType === SyntaxContextType.TABLE) {
    				const tableCompletions: ICompletionItem[] = []; // 一些表名自动补全项
    				syntaxCompletionItems = [...syntaxCompletionItems, ...tableCompletions];
    			}
    		});

    		return [...syntaxCompletionItems, ...keywordsCompletionItems];
    	});
    };

    registerFlinkSQLLanguage(completionService);
    ```

3. **创建 Monaco Editor 并指定语言**

    ```typescript
    monaco.editor.create(document.getElementById('container'), {
    	value: 'select * from tb_test',
    	language: 'flinksql' // languageId
    });
    ```

<br/>

## 开发者：本地开发

-   初始化设置

    ```shell
    pnpm install
    ```

-   本地启动 web demo

    ```shell
    pnpm watch-esm
    cd website
    pnpm install
    pnpm dev
    ```

-   打包

    ```shell
    pnpm compile
    ```

-   单元测试
    ```
    pnpm compile
    pnpm test
    ```

<br/>

## 行为守则

本项目采用 [Microsoft 开源行为准则](https://opensource.microsoft.com/codeofconduct/)。有关更多信息，请参阅 [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)，或联系 [opencode@microsoft.com](mailto:opencode@microsoft.com) 提出任何其他问题或意见。

## License

[MIT](https://github.com/Microsoft/monaco-languages/blob/master/LICENSE.md)
