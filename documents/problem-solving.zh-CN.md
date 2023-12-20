# 问题修复

[English](./problem-solving.md) | 简体中文

### 未找到 util

+ **浏览器报错信息**

    ```log
    Uncaught TypeError: Cannot read properties of undefined (reading 'custom')
    ```

+ **解决方案**

    安装 util

    ```bash
    npm install util
    ```

<hr/>

### 未找到 assert

+ **浏览器报错信息**

    ```log
    Uncaught Error: assert is not a function TypeError: assert is not a function
    ```

+ **解决方案**

    ```bash
    npm install assert
    ```

<hr/>

### [webpack] process 未定义

+ **浏览器报错信息**

    ```log
    Uncaught ReferenceError: process is not defined
    ```

+ **解决方案**

    在 `webpack.config.js` 中定义 `process.env.NODE_DEBUG`

    ```javascript
    const webpack = require('webpack');

    module.exports = {
        // ...
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_DEBUG': process.env.NODE_DEBUG,
            })
        ],
    }
    ```

    某些情况下，定义整个 `process.env` 可能导致一些怪异的问题，对于 Monaco SQL Languages 来说，只需要定义 `process.env.NODE_DEBUG` 就可以了。

<hr>

### [vite] process 未定义

+  **浏览器报错信息**

    ```log
    Uncaught ReferenceError: process is not defined
    ```

+ **解决方案**

    在 `vite.config.ts` 中定义 `process.env`

    ```typescript
    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";

    // https://vitejs.dev/config/
    export default defineConfig({
        define: {
            "process.env": process.env,
        },
    });
    ```

<hr>

### [vite] 加载 web-worker 失败

+ **浏览器报错信息**

    ```log
    Error: Unexpected usage at _EditorSimpleWorker.loadForeignModule (editorSimpleWorker.js:460:31) at webWorker.js:38:30
    ```

+ **解决方案**

    转换 worker 文件
    1. 创建一个新的 worker 文件, 例如命名为 `flinksql.worker.ts`

        ```typescript
        import "monaco-sql-languages/out/esm/flinksql/flinksql.worker";
        ```

    2. 导入新的 worker 文件

        ```typescript
        import FlinkSQLWorker from "./flinksql.worker?worker";

        self.MonacoEnvironment = {
            getWorker(_, label) {
                if (label === LanguageIdEnum.FLINK) {
                    return new FlinkSQLWorker();
                }
            },
        };
        ```


