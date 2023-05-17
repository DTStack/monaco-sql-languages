import { worker } from 'monaco-editor';
import PLSQL from 'dt-sql-parser/dist/parser/plsql';
import { ICreateData } from '../common/_.contribution';
import { BaseSQLWorker } from '../common/baseSQLWorker';

export class PLSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: PLSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super();
		this._ctx = ctx;
		this.parser = new PLSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): PLSQLWorker {
	return new PLSQLWorker(ctx, createData);
}
