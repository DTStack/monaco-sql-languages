import { worker } from '../fillers/monaco-editor-core';
import FlinkSQL from 'dt-sql-parser/dist/parser/flinksql';
import { BaseSQLWorker } from '../baseSQLWorker';
import { ICreateData } from '../_.contribution';

export class FLinkSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: FlinkSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super();
		this._ctx = ctx;
		this.parser = new FlinkSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): FLinkSQLWorker {
	return new FLinkSQLWorker(ctx, createData);
}
