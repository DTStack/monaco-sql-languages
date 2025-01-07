import { worker } from '../../fillers/monaco-editor-core';
import * as EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';
import { FLinkSQLWorker } from './flinkWorker';
import { ICreateData } from '../../baseSQLWorker';

self.onmessage = () => {
	// ignore the first message
	EditorWorker.initialize((ctx: worker.IWorkerContext, createData: ICreateData) => {
		return new FLinkSQLWorker(ctx, createData);
	});
};
