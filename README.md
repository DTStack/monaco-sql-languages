# Monaco SQL Languages

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-img]][download-url]

[npm-image]: https://img.shields.io/npm/v/monaco-sql-languages.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/monaco-sql-languages
[download-img]: https://img.shields.io/npm/dm/monaco-sql-languages.svg?style=flat
[download-url]: https://www.npmjs.com/package/monaco-sql-languages

English | [简体中文](./README-zh_CN.md)

This project is based on the SQL language project of Monaco Editor, which was forked from the [monaco-languages](https://github.com/microsoft/monaco-languages).

The difference is that Monaco SQL Languages has integrated with various SQL languages for the **Big Data field**, such as FlinkSQL, SparkSQL, HiveSQL, and others.

In addition, Monaco SQL Languages provides **SQL syntax validation** and **CodeCompletion** feature for these languages via [dt-sql-parser](https://github.com/DTStack/dt-sql-parser).

<br/>

## Online Preview
Powered By [molecule](https://github.com/DTStack/molecule).

<https://dtstack.github.io/monaco-sql-languages/>

<br/>

## Supported SQL Languages

-   MySQL
-   FlinkSQL
-   SparkSQL
-   HiveSQL
-   TrinoSQL (PrestoSQL)
-   PostgreSQL
-   Impala SQL

**Supported CodeCompletion SQL Languages**

| SQL Type   | Language Id | Code-Completion |
| ---------- | ----------- | --------------- |
| MySQL      | mysql       | ✅              |
| Flink SQL  | flinksql    | ✅              |
| Spark SQL  | sparksql    | ✅              |
| Hive SQL   | hivesql     | ✅              |
| Trino SQL  | trinosql    | ✅              |
| PostgreSQL | pgsql       | ✅              |
| Impala SQL | impalasql   | ✅              |

> Monaco SQL Languages plan to support more types of SQL Languages in the future. If you need some SQL Languages that are not currently supported, you can contact us at [github](https://github.com/DTStack/monaco-sql-languages).

<br/>

## Installing

```bash
npm install monaco-sql-languages
```

> Tips: Monaco SQL Languages is only guaranteed to work stably on `monaco-editor@0.31.0` for now.

<br/>

## Integrating

-  [Integrating the ESM version of Monaco SQL Languages](./documents/integrate-esm.md)
-  [Solving the problem of integrating](./documents/problem-solving.md)

<br/>

## Usage

1. **Import language contributions**
    > Tips: If integrated via MonacoEditorWebpackPlugin, it will help us to import contribution files automatically. Otherwise, you need to import the contribution files manually.

    ```typescript
    import 'monaco-sql-languages/out/esm/mysql/mysql.contribution';
    import 'monaco-sql-languages/out/esm/flinksql/flinksql.contribution';
    import 'monaco-sql-languages/out/esm/sparksql/sparksql.contribution';
    import 'monaco-sql-languages/out/esm/hivesql/hivesql.contribution';
    import 'monaco-sql-languages/out/esm/trinosql/trinosql.contribution';
    import 'monaco-sql-languages/out/esm/impalasql/impalasql.contribution';
    import 'monaco-sql-languages/out/esm/pgsql/pgsql.contribution';

    // Or you can import all language contributions at once.
    // import 'monaco-sql-languages/out/esm/monaco.contribution';
    ```

2. **Setup language features**

    You can setup language features via `setupLanguageFeatures`. For example, disable code completion feature of flinkSQL language.
    ```typescript
    import {
        setupLanguageFeatures,
        LanguageIdEnum,
    } from 'monaco-sql-languages';

    setupLanguageFeatures({
        languageId: LanguageIdEnum.FLINK,
        completionItems: false
    })
    ```

    By default, Monaco SQL Languages only provides keyword autocompletion, and you can customize your completionItem list via `completionService`.

    ```typescript
    import { languages } from 'monaco-editor/esm/vs/editor/editor.api';
    import {
        setupLanguageFeatures,
        LanguageIdEnum,
        CompletionService,
        ICompletionItem,
        SyntaxContextType
     } from 'monaco-sql-languages';

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

            resolve([...syntaxCompletionItems, ...keywordsCompletionItems]);
        });
    };

    setupLanguageFeatures({
        languageId: LanguageIdEnum.FLINK,
        completionService: completionService,
    })
    ```

3. **Create the Monaco Editor instance and specify the language you need**

    ```typescript
    monaco.editor.create(document.getElementById('container'), {
        value: 'select * from tb_test',
        language: 'flinksql' // you need
    });
    ```

<br/>

## Monaco Theme

> Monaco SQL Languages plan to support more themes in the future.

Monaco SQL Languages provides built-in Monaco Theme that is named `vsPlusTheme`. `vsPlusTheme` inspired by vscode default plus colorTheme and it contains three styles of themes inside:

-   `darkTheme`: inherited from Monaco built-in Theme `vs-dark`;
-   `lightTheme`: inherited from Monaco built-in Theme `vs`;
-   `hcBlackTheme`: inherited from Monaco built-in Theme `hc-black`;

**Use Monaco SQL Languages built-in vsPlusTheme**

```typescript
import { vsPlusTheme } from 'monaco-sql-languages';
import { editor } from 'monaco-editor';

// import themeData and defineTheme, you can customize the theme name, e.g. sql-dark
editor.defineTheme('sql-dark', vsPlusTheme.darkThemeData);
editor.defineTheme('sql-light', vsPlusTheme.lightThemeData);
editor.defineTheme('sql-hc', vsPlusTheme.hcBlackThemeData);

// specify the theme you have defined
editor.create(null as any, {
    theme: 'sql-dark',
    language: 'flinksql'
});
```

**Customize your own Monaco theme**

```typescript
import { TokenClassConsts, postfixTokenClass } from 'monaco-sql-languages';

// Customize the various tokens style
const myThemeData: editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: postfixTokenClass(TokenClassConsts.COMMENT), foreground: '6a9955' },
        { token: postfixTokenClass(TokenClassConsts.IDENTIFIER), foreground: '9cdcfe' },
        { token: postfixTokenClass(TokenClassConsts.KEYWORD), foreground: '569cd6' },
        { token: postfixTokenClass(TokenClassConsts.NUMBER), foreground: 'b5cea8' },
        { token: postfixTokenClass(TokenClassConsts.STRING), foreground: 'ce9178' },
        { token: postfixTokenClass(TokenClassConsts.TYPE), foreground: '4ec9b0' }
    ],
    colors: {}
};

// Define the monaco theme
editor.defineTheme('my-theme', myThemeData);
```

> `postfixTokenClass` is not required in most cases, but since Monaco SQL Languages has `tokenPostfix: 'sql'` internally set for all SQL languages, in some cases your custom style may not work if you don't use `postfixTokenClassClass` to handle `TokenClassConsts.*`.

<br/>

## Dev: cheat sheet

-   initial setup

    ```bash
    pnpm install
    ```

-   open the dev web

    ```bash
    pnpm watch-esm
    cd website
    pnpm install
    pnpm dev
    ```

-   compile

    ```bash
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

<br/>

## License

[MIT](https://github.com/Microsoft/monaco-languages/blob/master/LICENSE.md)
