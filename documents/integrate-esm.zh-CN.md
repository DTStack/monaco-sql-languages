# 集成 Monaco SQL Languages 的 ESM 版本

[English](./integrate-esm.md) | 简体中文

## 集成示例
`samples/` 文件夹下有一些集成示例，这里是这些示例的[开发文档](../samples/README.zh-CN.md)。

集成问题修复请查看[问题修复文档](./problem-solving.zh-CN.md)。

## 前置准备
由于 `dt-sql-parser` 依赖的 `antlr4ts` 内部引入了一些 Node.js 核心模块，包括：

+ `assert`
+ `util`
+ `fs`

在开始集成之前，需要安装这些模块的 polyfill 包以保证 Monaco SQL Languages 能正常运行，推荐以下 polyfill 包:
```bash
npm install assert util --save-dev
```

如果项目中使用的构建工具的 treeShaking 功能正常工作（绝大部分情况下如此），`fs` 模块的 polyfill 是不必要的。

更多关于 Node.js core modules polyfills 的信息，请查看 [webpack doc#resolvefallback](https://webpack.js.org/configuration/resolve/#resolvefallback)。

除此之外，你还需要定义环境变量 `process.env.NODE_DEBUG`，不同的打包工具定义的方式不同，参考下文中的示例。

<br/>

> 前置准备看起来有点繁琐，这为 Monaco SQL Languages 的集成带来了很多不必要的麻烦。我们正在尝试解决这个问题，比如替换 `dt-sql-parser` 中 ANTLR4 的运行时。

<br/>

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
            new webpack.DefinePlugin({
                'process.env.NODE_DEBUG': process.env.NODE_DEBUG,
            }),
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
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_DEBUG': process.env.NODE_DEBUG,
            }),
        ]
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
目前使用 vite 集成可能会出现无法加载 worker 文件的问题，详情请查看 [issue#87](https://github.com/DTStack/monaco-sql-languages/issues/87)

1. 在 `vite.config.ts` 中定义 `process.env`
    ```typescript
    export default defineConfig({
    // ...
    define: {
        'process.env': process.env
    }
    });
    ```

2. 定义全局变量 `MonacoEnvironment`, 并声明 `getWorkerUrl`
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
