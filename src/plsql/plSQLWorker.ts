import { worker } from '../fillers/monaco-editor-core';
import { PLSQL } from 'dt-sql-parser/dist/parser/plsql';
import { BaseSQLWorker, ICreateData } from '../baseSQLWorker';

export class PLSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: PLSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super(ctx, createData);
		this._ctx = ctx;
		this.parser = new PLSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): PLSQLWorker {
	return new PLSQLWorker(ctx, createData);
}
