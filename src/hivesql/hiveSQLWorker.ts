import { worker } from 'monaco-editor';
import HiveSQL from 'dt-sql-parser/dist/parser/hive';
import { ICreateData } from '../common/_.contribution';
import { BaseSQLWorker } from '../common/baseSQLWorker';

export class HiveSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: HiveSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super();
		this._ctx = ctx;
		this.parser = new HiveSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): HiveSQLWorker {
	return new HiveSQLWorker(ctx, createData);
}
