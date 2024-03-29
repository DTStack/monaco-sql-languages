import { worker } from '../fillers/monaco-editor-core';
import { PostgreSQL } from 'dt-sql-parser/dist/parser/postgresql';
import { ICreateData } from '../_.contribution';
import { BaseSQLWorker } from '../baseSQLWorker';
export class PgSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: PostgreSQL;
	constructor(ctx: worker.IWorkerContext, _createData: ICreateData) {
		// CreatedData is not required now.
		super();
		this._ctx = ctx;
		this.parser = new PostgreSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): PgSQLWorker {
	return new PgSQLWorker(ctx, createData);
}
