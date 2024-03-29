import { worker } from '../fillers/monaco-editor-core';
import { MySQL } from 'dt-sql-parser/dist/parser/mysql';
import { ICreateData } from '../_.contribution';
import { BaseSQLWorker } from '../baseSQLWorker';

export class MySQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: MySQL;
	constructor(ctx: worker.IWorkerContext, _createData: ICreateData) {
		// CreatedData is not required now.
		super();
		this._ctx = ctx;
		this.parser = new MySQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): MySQLWorker {
	return new MySQLWorker(ctx, createData);
}
