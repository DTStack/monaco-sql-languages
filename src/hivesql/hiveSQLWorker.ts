import { worker } from '../fillers/monaco-editor-core';
import HiveSQL from 'dt-sql-parser/dist/parser/hive';
import { ICreateData } from '../_.contribution';
import { BaseSQLWorker } from '../baseSQLWorker';

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
