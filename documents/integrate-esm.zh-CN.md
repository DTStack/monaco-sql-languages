# 集成 Monaco SQL Languages 的 ESM 版本

[English](./integrate-esm.md) | 简体中文

## 集成示例
`samples/` 文件夹下有一些集成示例，这里是这些示例的[开发文档](../samples/README.zh-CN.md)。

## 使用 Monaco Editor WebPack Plugin
这是集成 Monaco SQL Languages 最简单的方式

-   安装 Monaco Editor Webpack Plugin

    ```bash
    npm install monaco-editor-webpack-plugin
    ```

-   在 Webpack 配置中应用 Monaco Editor Webpack Plugin

    ```typescript
    const webpack = require('webpack');
    const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

    const monacoWebpackPlugin = new MonacoWebpackPlugin({
        features: [], // 包含你所需要的 Monaco Editor 功能
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
            monacoEditorPlugin // 应用 monacoEditorPlugin
        ]
    };
    ```

更多 Monaco Editor Webpack Plugin 的选项, 看[这里](https://github.com/microsoft/monaco-editor/tree/main/webpack-plugin#options).

<br/>

## 普通方式使用 Webpack

1. 以 webpack entry 的方式输出 worker 文件

    ```typescript
    const webpack = require('webpack');

    module.exports = {
        entry: {
            'mysql.worker': 'monaco-sql-languages/out/esm/mysql/mysql.worker.js',
            'flinksql.worker': 'monaco-sql-languages/out/esm/flinksql/flinksql.worker.js',
            'sparksql.worker': 'monaco-sql-languages/out/esm/sparksql/sparksql.worker.js',
            'hivesql.worker': 'monaco-sql-languages/out/esm/hivesql/hivesql.worker.js',
            'trinosql.worker': 'monaco-sql-languages/out/esm/trinosql/trinosql.worker.js',
            'pgsql.worker': 'monaco-sql-languages/out/esm/pgsql/pgsql.worker.js',
            'impalasql.worker': 'monaco-sql-languages/out/esm/impalasql/impalasql.worker.js',
            'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
        }
    };
    ```

2. 定义全局变量 `MonacoEnvironment`, 并声明 `getWorkerUrl`

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

## 使用 Vite

1. 定义全局变量 `MonacoEnvironment`, 并声明 `getWorkerUrl`
    ```typescript
    import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
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
