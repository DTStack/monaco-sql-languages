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
                entry: 'monaco-sql-languages/esm/languages/mysql/mysql.contribution',
                worker: {
                    id: '/esm/languages/mysql/',
                    entry: 'monaco-sql-languages/esm/languages/mysql/mysql.worker'
                }
            },
            {
                label: 'flinksql',
                entry: 'monaco-sql-languages/esm/languages/flink/flink.contribution',
                worker: {
                    id: '/esm/languages/flink/',
                    entry: 'monaco-sql-languages/esm/languages/flink/flink.worker'
                }
            },
            {
                label: 'sparksql',
                entry: 'monaco-sql-languages/esm/languages/spark/spark.contribution',
                worker: {
                    id: '/esm/languages/spark/',
                    entry: 'monaco-sql-languages/esm/languages/spark/spark.worker'
                }
            },
            {
                label: 'hivesql',
                entry: 'monaco-sql-languages/esm/languages/hive/hive.contribution',
                worker: {
                    id: '/esm/languages/hive/',
                    entry: 'monaco-sql-languages/esm/languages/hive/hive.worker'
                }
            },
            {
                label: 'trinosql',
                entry: 'monaco-sql-languages/esm/languages/trino/trino.contribution',
                worker: {
                    id: '/esm/languages/trino/',
                    entry: 'monaco-sql-languages/esm/languages/trino/trino.worker'
                }
            },
            {
                label: 'pgsql',
                entry: 'monaco-sql-languages/esm/languages/pgsql/pgsql.contribution',
                worker: {
                    id: '/esm/languages/pgsql/',
                    entry: 'monaco-sql-languages/esm/languages/pgsql/pgsql.worker'
                }
            },
            {
                label: 'impalasql',
                entry: 'monaco-sql-languages/esm/languages/impala/impala.contribution',
                worker: {
                    id: '/esm/languages/impala/',
                    entry: 'monaco-sql-languages/esm/languages/impala/impala.worker'
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
            'mysql.worker': 'monaco-sql-languages/esm/languages/mysql/mysql.worker.js',
			'flink.worker': 'monaco-sql-languages/esm/languages/flink/flink.worker.js',
			'spark.worker': 'monaco-sql-languages/esm/languages/spark/spark.worker.js',
			'hive.worker': 'monaco-sql-languages/esm/languages/hive/hive.worker.js',
			'trino.worker': 'monaco-sql-languages/esm/languages/trino/trino.worker.js',
			'pgsql.worker': 'monaco-sql-languages/esm/languages/pgsql/pgsql.worker.js',
			'impala.worker': 'monaco-sql-languages/esm/languages/impala/impala.worker.js',
			'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
        }
    };
    ```

2. 定义全局变量 `MonacoEnvironment`, 并声明 `getWorkerUrl`

    ```typescript
	import { LanguageIdEnum } from 'monaco-sql-languages';

	/** define MonacoEnvironment.getWorkerUrl  */
	(globalThis as any).MonacoEnvironment = {
		getWorkerUrl: function (_moduleId: string, label: string) {
			switch (label) {
				case LanguageIdEnum.MYSQL: {
					return './mysql.worker.js';
				}
				case LanguageIdEnum.SPARK: {
					return './spark.worker.js';
				}
				case LanguageIdEnum.FLINK: {
					return './flink.worker.js';
				}
				case LanguageIdEnum.HIVE: {
					return './hive.worker.js';
				}
				case LanguageIdEnum.TRINO: {
					return './trino.worker.js';
				}
				case LanguageIdEnum.PG: {
					return './pgsql.worker.js';
				}
				case LanguageIdEnum.IMPALA: {
					return './impala.worker.js'
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

定义全局变量 `MonacoEnvironment`, 并声明 `getWorkerUrl`

```typescript
import { LanguageIdEnum } from 'monaco-sql-languages';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import FlinkSQLWorker from 'monaco-sql-languages/esm/languages/flink/flink.worker?worker';
import SparkSQLWorker from 'monaco-sql-languages/esm/languages/spark/spark.worker?worker';
import HiveSQLWorker from 'monaco-sql-languages/esm/languages/hive/hive.worker?worker';
import PGSQLWorker from 'monaco-sql-languages/esm/languages/pgsql/pgsql.worker?worker';
import MySQLWorker from 'monaco-sql-languages/esm/languages/mysql/mysql.worker?worker';
import TrinoSQLWorker from 'monaco-sql-languages/esm/languages/trino/trino.worker?worker';
import ImpalaSQLWorker from 'monaco-sql-languages/esm/languages/impala/impala.worker?worker';

(globalThis as any).MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === LanguageIdEnum.FLINK) {
			return new FlinkSQLWorker();
		}
		if (label === LanguageIdEnum.HIVE) {
			return new HiveSQLWorker();
		}
		if (label === LanguageIdEnum.SPARK) {
			return new SparkSQLWorker();
		}
		if (label === LanguageIdEnum.PG) {
			return new PGSQLWorker();
		}
		if (label === LanguageIdEnum.MYSQL) {
			return new MySQLWorker();
		}
		if (label === LanguageIdEnum.TRINO) {
			return new TrinoSQLWorker();
		}
		if (label === LanguageIdEnum.IMPALA) {
			return new ImpalaSQLWorker();
		}
		return new EditorWorker();
	}
};
```
