import { worker } from '../../fillers/monaco-editor-core';
import { SparkSQL } from 'dt-sql-parser/dist/parser/spark';
import { BaseSQLWorker, ICreateData } from '../../baseSQLWorker';

export class SparkSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: SparkSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super(ctx, createData);
		this._ctx = ctx;
		this.parser = new SparkSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): SparkSQLWorker {
	return new SparkSQLWorker(ctx, createData);
}
