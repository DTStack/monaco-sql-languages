import { worker } from '../fillers/monaco-editor-core';
import * as EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';
import { ImpalaSQLWorker, ICreateData } from './impalaSQLWorker';

self.onmessage = (e: any) => {
	EditorWorker.initialize((ctx: worker.IWorkerContext, createData: ICreateData) => {
		return new ImpalaSQLWorker(ctx, createData);
	});
};
