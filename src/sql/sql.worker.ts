import { worker } from 'monaco-editor';
import * as EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';
import { ICreateData } from '../common/_.contribution';
import { SQLWorker } from './sqlWorker';

self.onmessage = (e: any) => {
	EditorWorker.initialize((ctx: worker.IWorkerContext, createData: ICreateData) => {
		return new SQLWorker(ctx, createData);
	});
};
