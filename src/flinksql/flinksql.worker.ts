import { worker } from '../fillers/monaco-editor-core';
import * as EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';
import { FLinkSQLWorker, ICreateData } from './flinkSQLWorker';

self.onmessage = (e: any) => {
    EditorWorker.initialize((ctx: worker.IWorkerContext, createData: ICreateData) => {
        return new FLinkSQLWorker(ctx, createData);
    });
};
