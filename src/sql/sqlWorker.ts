import { worker } from 'monaco-editor';
import MySQL from 'dt-sql-parser/dist/parser/generic';
import { ICreateData } from '../common/_.contribution';
import { BaseSQLWorker } from '../common/baseSQLWorker';

export class SQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: MySQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super();
		this._ctx = ctx;
		this.parser = new MySQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): SQLWorker {
	return new SQLWorker(ctx, createData);
}
