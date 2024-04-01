import { worker } from '../../fillers/monaco-editor-core';
import { PostgreSQL } from 'dt-sql-parser/dist/parser/postgresql';
import { BaseSQLWorker, ICreateData } from '../../baseSQLWorker';

export class PgSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: PostgreSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super(ctx, createData);
		this._ctx = ctx;
		this.parser = new PostgreSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): PgSQLWorker {
	return new PgSQLWorker(ctx, createData);
}
