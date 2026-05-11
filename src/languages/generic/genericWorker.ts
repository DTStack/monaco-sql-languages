import { worker } from '../../fillers/monaco-editor-core';
import { GenericSQL } from 'dt-sql-parser/dist/parser/generic';
import { BaseSQLWorker, ICreateData } from '../../baseSQLWorker';

export class GenericSQLWorker extends BaseSQLWorker {
	protected _ctx: worker.IWorkerContext;
	protected parser: GenericSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		super(ctx, createData);
		this._ctx = ctx;
		this.parser = new GenericSQL();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): GenericSQLWorker {
	return new GenericSQLWorker(ctx, createData);
}
