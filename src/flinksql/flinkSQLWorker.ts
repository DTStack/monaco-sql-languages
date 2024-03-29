import { worker } from '../fillers/monaco-editor-core';
import { FlinkSQL } from 'dt-sql-parser/dist/parser/flink';
import { BaseSQLWorker } from '../baseSQLWorker';
import { ICreateData } from '../_.contribution';

export class FLinkSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: FlinkSQL;
	constructor(ctx: worker.IWorkerContext, _createData: ICreateData) {
		// CreatedData is not required now.
		super();
		this._ctx = ctx;
		this.parser = new FlinkSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): FLinkSQLWorker {
	return new FLinkSQLWorker(ctx, createData);
}
