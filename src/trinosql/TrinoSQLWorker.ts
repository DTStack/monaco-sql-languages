import { worker } from '../fillers/monaco-editor-core';
import { TrinoSQL } from 'dt-sql-parser/dist/parser/trino';
import { BaseSQLWorker, ICreateData } from '../baseSQLWorker';

export class TrinoSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: TrinoSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super(ctx, createData);
		this._ctx = ctx;
		this.parser = new TrinoSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): TrinoSQLWorker {
	return new TrinoSQLWorker(ctx, createData);
}
