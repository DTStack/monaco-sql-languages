import { worker } from '../../fillers/monaco-editor-core';
import * as EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';
import { ICreateData } from '../../baseSQLWorker';
import { TrinoSQLWorker } from './trinoWorker';

self.onmessage = () => {
	// ignore the first message
	EditorWorker.initialize((ctx: worker.IWorkerContext, createData: ICreateData) => {
		return new TrinoSQLWorker(ctx, createData);
	});
};
