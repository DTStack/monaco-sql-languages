import { worker } from '../fillers/monaco-editor-core';
import * as EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';
import { FLinkSQLWorker } from './flinkSQLWorker';
import { ICreateData } from '../_.contribution';

self.onmessage = (e: any) => {
	EditorWorker.initialize((ctx: worker.IWorkerContext, createData: ICreateData) => {
		return new FLinkSQLWorker(ctx, createData);
	});
};
