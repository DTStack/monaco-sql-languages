import { worker } from '../fillers/monaco-editor-core';
import { TrinoSQL } from 'dt-sql-parser/dist/parser/trino';
import { ICreateData } from '../_.contribution';
import { BaseSQLWorker } from '../baseSQLWorker';

export class TrinoSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: TrinoSQL;
	constructor(ctx: worker.IWorkerContext, _createData: ICreateData) {
		// CreatedData is not required now.
		super();
		this._ctx = ctx;
		this.parser = new TrinoSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): TrinoSQLWorker {
	return new TrinoSQLWorker(ctx, createData);
}
