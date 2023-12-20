# Integrate ESM version of Monaco SQL Languages

English | [简体中文](./integrate-esm.zh-CN.md)

## Integration Samples
There are some integration samples in `samples/` folder, here is the [development doc](../samples/README.md) of these samples.

Integration problem solving refer to [problem-soling](./problem-solving.md).


## Prerequisites
Since `dt-sql-parser` depends on `antlr4ts` which imports some Node.js core modules internally, including:

+ `assert`
+ `util`
+ `fs`

Before starting the integration, you need to install the polyfills of these modules to make sure Monaco SQL Languages can run properly, the following polyfill packages are recommended:
```bash
npm install assert util --save-dev
```

If the treeShaking of the bundler used in the project works well (which is the case in most situations), the polyfill of `fs` module is not necessary.

More about polyfill of Node.js core modules, refer to [webpack doc#resolvefallback](https://webpack.js.org/configuration/resolve/#resolvefallback)。

Besides, you also need to define the environment variable `process.env.NODE_DEBUG`, different building tools have different ways to define it, refer to the samples in the following context.

<br/>

> The prerequisites seem to be a bit cumbersome, which brings a lot of unnecessary troubles to the integration of Monaco SQL Languages. We are trying to solve this problem, such as replacing the runtime of ANTLR4 in `dt-sql-parser`.

<br/>

## Use Monaco Editor WebPack Plugin
This is the easiest way to integrate Monaco SQL Languages

-   Install Monaco Editor Webpack Plugin

    ```bash
    npm install monaco-editor-webpack-plugin
    ```

-   Apply Monaco Editor Webpack Plugin in Webpack configuration

    ```typescript
    const webpack = require('webpack');
    const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

    const monacoWebpackPlugin = new MonacoWebpackPlugin({
        features: [], // Contains the Monaco Editor features you need
        languages: [], // Contains the built-in language features of Monaco Editor you need
        customLanguages: [
            // Contains the language features provided by Monaco SQL Languages
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
                label: 'impalasql',
                entry: 'monaco-sql-languages/out/esm/impalasql/impalasql.contribution',
                worker: {
                    id: 'monaco-sql-languages/out/esm/impalasql/impalaSQLWorker',
                    entry: 'monaco-sql-languages/out/esm/impalasql/impalasql.worker'
                }
            }
        ]
    });

    module.exports = {
        // ...
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_DEBUG': process.env.NODE_DEBUG,
            }),
            monacoEditorPlugin // Apply monacoEditorPlugin
        ]
    };
    ```

More options of Monaco Editor Webpack Plugin, refer to [here](https://github.com/microsoft/monaco-editor/tree/main/webpack-plugin#options).

<br/>

## Use Plain Webpack

1. Output worker files in the way of webpack entry

    ```typescript
    const webpack = require('webpack');

    module.exports = {
        // ...
        entry: {
            'mysql.worker': 'monaco-sql-languages/out/esm/mysql/mysql.worker.js',
            'flinksql.worker': 'monaco-sql-languages/out/esm/flinksql/flinksql.worker.js',
            'sparksql.worker': 'monaco-sql-languages/out/esm/sparksql/sparksql.worker.js',
            'hivesql.worker': 'monaco-sql-languages/out/esm/hivesql/hivesql.worker.js',
            'trinosql.worker': 'monaco-sql-languages/out/esm/trinosql/trinosql.worker.js',
            'pgsql.worker': 'monaco-sql-languages/out/esm/pgsql/pgsql.worker.js',
            'impalasql.worker': 'monaco-sql-languages/out/esm/impalasql/impalasql.worker.js',
            'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_DEBUG': process.env.NODE_DEBUG, // define process.env.NODE_DEBUG
            }),
        ]
    };
    ```

2. Define `MonacoEnvironment` and declare `getWorkerUrl`

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
                case 'impalasql': {
                    return './impalasql.worker.js'
                }
                default: {
                    return './editor.worker.js';
                }
            }
        }
    };
    ```

<br/>

## Use Vite
Currently, there might be a problem that worker files cannot be loaded when integrating with vite, for details please refer to [issue#87](https://github.com/DTStack/monaco-sql-languages/issues/87)

1. define `process.env` in `vite.config.ts`
    ```typescript
    export default defineConfig({
        // ...
        define: {
            'process.env': process.env
        }
    });
    ```

2. Define `MonacoEnvironment` and declare `getWorker`
    ```typescript
    import EditorWorker from '../../node_modules/monaco-editor/esm/vs/editor/editor.worker?worker';

    import FlinkSQLWorker from 'monaco-sql-languages/out/esm/flinksql/flinksql.worker?worker';
    import SparkSQLWorker from 'monaco-sql-languages/out/esm/sparksql/sparksql.worker?worker';
    import HiveSQLWorker from 'monaco-sql-languages/out/esm/hivesql/hivesql.worker?worker';
    import PGSQLWorker from 'monaco-sql-languages/out/esm/pgsql/pgsql.worker?worker';
    import MySQLWorker from 'monaco-sql-languages/out/esm/mysql/mysql.worker?worker';
    import TrinoSQLWorker from 'monaco-sql-languages/out/esm/trinosql/trinosql.worker?worker';
    import ImpalaSQLWorker from 'monaco-sql-languages/out/esm/impalasql/impalasql.worker?worker';

    self.MonacoEnvironment = {
        getWorker(_, label) {
            if (label === 'flinksql') {
                return new FlinkSQLWorker();
            }
            if (label === 'hivesql') {
                return new HiveSQLWorker();
            }
            if (label === 'sparksql') {
                return new SparkSQLWorker();
            }
            if (label === 'pgsql') {
                return new PGSQLWorker();
            }
            if (label === 'mysql') {
                return new MySQLWorker();
            }
            if (label === 'trinosql') {
                return new TrinoSQLWorker();
            }
            if (label === 'impalasql') {
                return new ImpalaSQLWorker();
            }
            return new EditorWorker();
        }
    };
    ```
