import { worker } from 'monaco-editor';
import * as EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';
import { ICreateData } from '../_.contribution';
import { SparkSQLWorker } from './sparkSQLWorker';

self.onmessage = (e: any) => {
	EditorWorker.initialize((ctx: worker.IWorkerContext, createData: ICreateData) => {
		const workerInstance = new SparkSQLWorker(ctx, createData);
		console.log('workerInstance', workerInstance);
		return workerInstance;
	});
};
