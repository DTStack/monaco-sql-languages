# Monaco SQL Languages [![Build Status](https://dev.azure.com/ms/monaco-languages/_apis/build/status/microsoft.monaco-languages?branchName=master)](https://dev.azure.com/ms/monaco-languages/_build/latest?definitionId=140&branchName=master)

This is a SQL Languages project for Monaco Editor forked it from [monaco-languages](https://github.com/microsoft/monaco-languages). The differences are we integrated with
many kinds of SQL Languages for BigData domain, like FLinkSQL, SParkSQL, HiveSQL and so on. We provided the basic **SQL syntax** validation feature by [dt-sql-parser](https://github.com/DTStack/dt-sql-parser), and we are going to provide **Autocomplete** feature in future.

Online preview: <https://dtstack.github.io/monaco-sql-languages/>

## Supported SQL Languages

-   Generic SQL (MySQL)
-   FLinkSQL
-   SparkSQL
-   HiveSQL
-   PGSQL
-   PLSQL

## Installation

```bash
npm install monaco-sql-languages
```

or

```bash

> yarn add monaco-sql-languages
```

## Usage

Add language worker in `Webpack` `entry` field:

```javascript
entry: {
 'sparksql.worker': 'monaco-sql-languages/out/esm/sparksql/sparksql.worker.ts',
 'flinksql.worker': 'monaco-sql-languages/out/esm/flinksql/flinksql.worker.ts'),
 'hivesql.worker': 'monaco-sql-languages/out/esm/hivesql/hivesql.worker.ts'),
 'mysql.worker': 'monaco-sql-languages/out/esm/mysql/mysql.worker.ts'),
 'plsql.worker': 'monaco-sql-languages/out/esm/plsql/plsql.worker.ts'),
 'sql.worker': 'monaco-sql-languages/out/esm/sql/sql.worker.ts')
},
```

Define the `MonacoEnvironment` for `worker` file:

```javascript
window.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		switch (label) {
			case 'sparksql': {
				return './sparksql.worker.js';
			}
			case 'flinksql': {
				return './flinksql.worker.js';
			}
			case 'hivesql': {
				return './hivesql.worker.js';
			}
			case 'mysql': {
				return './mysql.worker.js';
			}
			case 'plsql': {
				return './plsql.worker.js';
			}
			case 'sql': {
				return './sql.worker.js';
			}
			default: {
				return './editor.worker.js';
			}
		}
	}
};
```

Import the language contribution before creating the editor by `monaco-editor`.

```javascript
import 'monaco-sql-languages/out/esm/flinksql/flinksql.contribution';
import 'monaco-sql-languages/out/esm/hivesql/hivesql.contribution';
import 'monaco-sql-languages/out/esm/sparksql.contribution';
import 'monaco-sql-languages/out/esm/mysql.contribution';
import 'monaco-sql-languages/out/esm/plsql.contribution';
import 'monaco-sql-languages/out/esm/sql/sql.contribution';
```

Then, set the language value you need when creating the `moanco-editor` instance:

```
monaco.editor.create(document.getElementById("container"), {
 value: "select * from tb_test",
 language: "sql" // you need
});

```

> Tips: you can change the editor model language by `monaco.editor.setModelLanguage(model, language)`

## Example

Reference from [here](https://github.com/DTStack/monaco-sql-languages/blob/main/web/extensions/workbench/index.tsx).

## Dev: cheat sheet

-   initial setup with `npm install .`
-   open the dev web with `npm run dev`
-   compile with `npm run watch`
-   test with `npm run test`
-   bundle with `npm run prepublishOnly`

## Dev: Adding a new language

-   create `$/src/myLang/myLang.contribution.ts`
-   create `$/src/myLang/myLang.ts`
-   create `$/src/myLang/myLang.test.ts`
-   edit `$/src/monaco.contribution.ts` and register your new language

```js
import './myLang/myLang.contribution';
```

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License

[MIT](https://github.com/Microsoft/monaco-languages/blob/master/LICENSE.md)
