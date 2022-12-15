import { worker } from 'monaco-editor';
import PgSQL from 'dt-sql-parser/dist/parser/pgsql';
import { ICreateData } from '../_.contribution';
import { BaseSQLWorker } from '../baseSQLWorker';

export class PgSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: PgSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super();
		this._ctx = ctx;
		this.parser = new PgSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): PgSQLWorker {
	return new PgSQLWorker(ctx, createData);
}
