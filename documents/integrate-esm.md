# Integrate ESM version of Monaco SQL Languages

English | [简体中文](./integrate-esm.zh-CN.md)

## Integration Samples
There are some integration samples in `samples/` folder, here is the [development doc](../samples/README.md) of these samples.


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
			         monacoEditorPlugin // Apply  monacoEditorPlugin
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

2. Define `MonacoEnvironment` and declare `getWorkerUrl`

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


## Use Vite

Define `MonacoEnvironment` and declare `getWorker`

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
