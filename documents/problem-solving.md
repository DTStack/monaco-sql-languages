# Problem Solving

English | [简体中文](./problem-solving.zh-CN.md)

### util is not found

+ **Error log in browser**

    ```log
    Uncaught TypeError: Cannot read properties of undefined (reading 'custom')
    ```

+ **Solution**

    Install util package

    ```bash
    npm install util
    ```

<hr/>

### assert is not found

+ **Error log in browser**

    ```log
    Uncaught Error: assert is not a function TypeError: assert is not a function
    ```

+ **Solution**

    ```bash
    npm install assert
    ```

<hr/>

### [webpack] process is not defined

+ **Error log in browser**

    ```log
    Uncaught ReferenceError: process is not defined
    ```

+ **Solution**

    Define `process.env.NODE_DEBUG` in `webpack.config.ts`

    ```javascript
    const webpack = require('webpack');

    module.exports = {
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_DEBUG': process.env.NODE_DEBUG,
            })
        ],
    }
    ```
    Don't define the `process.env`! This time it may cause weird problems in this project. Just define `process.env.NODE_DEBUG`, and everything works well!

<hr/>

### [vite] process is not defined

+ **Error log in browser**

    ```log
    Uncaught ReferenceError: process is not defined
    ```

+ **Solution**

    Define `process.env` in `vite.config.ts`

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

<hr/>

### [vite] Failed to load web-worker

+ **Error log in browser**

    ```log
    Error: Unexpected usage at _EditorSimpleWorker.loadForeignModule (editorSimpleWorker.js:460:31) at webWorker.js:38:30
    ```

+ **Solution**

    Transform worker file

    1. create a new worker file, e.g. named `flinksql.worker.ts`

        ```typescript
        import "monaco-sql-languages/out/esm/flinksql/flinksql.worker";
        ```

    2. import the transformed worker file

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


