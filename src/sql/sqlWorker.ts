import { worker } from '../fillers/monaco-editor-core';
import { MySQL } from 'dt-sql-parser/dist/parser/mysql';
import { BaseSQLWorker, ICreateData } from '../baseSQLWorker';

export class SQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: MySQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super(ctx, createData);
		this._ctx = ctx;
		this.parser = new MySQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): SQLWorker {
	return new SQLWorker(ctx, createData);
}
