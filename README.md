# Monaco SQL Languages [![NPM version][npm-image]][npm-url] [![NPM downloads][download-img]][download-url]

[npm-image]: https://img.shields.io/npm/v/monaco-sql-languages.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/monaco-sql-languages
[download-img]: https://img.shields.io/npm/dm/monaco-sql-languages.svg?style=flat
[download-url]: https://www.npmjs.com/package/monaco-sql-languages

This project is based on the SQL language project of Monaco Editor, which was forked from the [monaco-languages](https://github.com/microsoft/monaco-languages).

The difference is that Monaco SQL Languages has integrated with various SQL languages for the **Big Data field**, such as FLinkSQL, SparkSQL, HiveSQL, and others.

In addition, Monaco SQL Languages provides **SQL syntax validation** and **CodeCompletion** feature for these languages via [dt-sql-parser](https://github.com/DTStack/dt-sql-parser).

Online Preview: <https://dtstack.github.io/monaco-sql-languages/>

## Supported SQL Languages

-   MySQL
-   FLinkSQL
-   SparkSQL
-   HiveSQL
-   TrinoSQL (PrestoSQL)
-   PostgreSQL
-   PL/SQL

**Supported CodeCompletion SQL Languages**

| SQL Type   | Language Id | Code-Completion |
| ---------- | ----------- | --------------- |
| MySQL      | mysql       | WIP             |
| Flink SQL  | flinksql    | ✅              |
| Spark SQL  | sparksql    | ✅              |
| Hive SQL   | hivesql     | ✅              |
| Trino SQL  | trinosql    | ✅              |
| PostgreSQL | pgsql       | WIP             |
| PL/SQL     | plsql       | WIP             |

<br/>

## Installing

```shell
npm install monaco-sql-languages
```

> Tips: Your version of Monaco Editor should be 0.31.0, Monaco SQL Languages is only guaranteed to work stably on `monaco-editor@0.31.0` for now.

<br/>

## Integrating

-   [Integrating the ESM version](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md)
-   [Integrating the AMD version](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-amd.md#integrating-the-amd-version-of-the-monaco-editor)

### Using the Monaco Editor WebPack Plugin

-   Install Monaco Editor Webpack Plugin

    ```shell
    npm install monaco-editor-webpack-plugin
    ```

-   Apply Monaco Editor Webpack Plugin in webpack config

    ```typescript
    const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
    const path = require('path');

    const monacoWebpackPlugin = new MonacoWebpackPlugin({
    	features: [], // Include only a subset of the editor features
    	languages: [], // Include only a subset of the monaco built-in languages
    	customLanguages: [
    		// Include languages that provides by Monaco SQL Languages
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
    	plugins: [monacoEditorPlugin] // Apply monacoWebpackPlugin
    };
    ```

More options of Monaco Editor Webpack Plugin, see [here](https://github.com/microsoft/monaco-editor/tree/main/webpack-plugin#options).

### Using Plain Webpack

Output worker files via webpack entries.

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

Define the global variable `MonacoEnvironment` and specify the path of the worker file

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

### Using Vite

Vite example see <https://github.com/DTStack/monaco-sql-languages/blob/main/website/src/languageWorker.ts>

<br/>

## Usage

1. **Import language contributions**

    ```typescript
    // Directly import contribution files for languages that don't support codeCompletion.
    import 'monaco-sql-languages/out/esm/mysql/mysql.contribution';
    import 'monaco-sql-languages/out/esm/plsql/plsql.contribution';
    import 'monaco-sql-languages/out/esm/pgsql/pgsql.contribution';
    import 'monaco-sql-languages/out/esm/sql/sql.contribution';

    // Import register method for languages that support codeCompletion.
    import {
    	registerHiveSQLLanguage,
    	registerFlinkSQLLanguage,
    	registerSparkSQLLanguage,
    	registerTrinoSQLLanguage
    } from 'monaco-sql-languages';

    // Register language, completionService is not a must.
    registerFlinkSQLLanguage();
    registerHiveSQLLanguage();
    registerSparkSQLLanguage();
    registerTrinoSQLLanguage();

    // Or you can import all language contributions at once.
    // import 'monaco-sql-languages/out/esm/monaco.contribution';
    ```

2. **Build a completionService**

    By default, only keywords are included in completionItems, and you can customize your completionItem list via `completionService`.

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
    				const databaseCompletions: ICompletionItem[] = []; // some completions about databaseName
    				syntaxCompletionItems = [...syntaxCompletionItems, ...databaseCompletions];
    			}
    			if (item.syntaxContextType === SyntaxContextType.TABLE) {
    				const tableCompletions: ICompletionItem[] = []; // some completions about tableName
    				syntaxCompletionItems = [...syntaxCompletionItems, ...tableCompletions];
    			}
    		});

    		return [...syntaxCompletionItems, ...keywordsCompletionItems];
    	});
    };

    registerFlinkSQLLanguage(completionService);
    ```

3. **Create the Monaco Editor instance and specify the language you need**

    ```typescript
    monaco.editor.create(document.getElementById('container'), {
    	value: 'select * from tb_test',
    	language: 'flinksql' // you need
    });
    ```

<br/>

## Dev: cheat sheet

-   initial setup

    ```shell
    pnpm install
    ```

-   open the dev web

    ```shell
    pnpm watch-esm
    cd website
    pnpm install
    pnpm dev
    ```

-   compile

    ```shell
    pnpm compile
    ```

-   run test
    ```
    pnpm compile
    pnpm test
    ```

<br/>

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License

[MIT](https://github.com/Microsoft/monaco-languages/blob/master/LICENSE.md)
