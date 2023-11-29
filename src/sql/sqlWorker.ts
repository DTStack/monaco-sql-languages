import { worker } from '../fillers/monaco-editor-core';
import GenericSQL from 'dt-sql-parser/dist/parser/mysql';
import { ICreateData } from '../_.contribution';
import { BaseSQLWorker } from '../baseSQLWorker';

export class SQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: GenericSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super();
		this._ctx = ctx;
		this.parser = new GenericSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): SQLWorker {
	return new SQLWorker(ctx, createData);
}
