import { worker } from '../fillers/monaco-editor-core';
import { SparkSQL } from 'dt-sql-parser/dist/parser/spark';
import { ICreateData } from '../_.contribution';
import { BaseSQLWorker } from '../baseSQLWorker';

export class SparkSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: SparkSQL;
	constructor(ctx: worker.IWorkerContext, _createData: ICreateData) {
		// CreatedData is not required now.
		super();
		this._ctx = ctx;
		this.parser = new SparkSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): SparkSQLWorker {
	return new SparkSQLWorker(ctx, createData);
}
