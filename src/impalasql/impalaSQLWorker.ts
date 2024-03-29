import { worker } from '../fillers/monaco-editor-core';
import { ImpalaSQL } from 'dt-sql-parser/dist/parser/impala';
import { BaseSQLWorker, ICreateData } from '../baseSQLWorker';

export class ImpalaSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: ImpalaSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super(ctx, createData);
		this._ctx = ctx;
		this.parser = new ImpalaSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): ImpalaSQLWorker {
	return new ImpalaSQLWorker(ctx, createData);
}
