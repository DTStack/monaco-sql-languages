import { worker } from 'monaco-editor';
import HiveSQL from 'dt-sql-parser/dist/parser/hive';
import { ICreateData } from '../_.contribution';

export class HiveSQLWorker {
	private _ctx: worker.IWorkerContext;
	private parser: typeof HiveSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this.parser = new HiveSQL();
	}

	async doValidation(uri: string): Promise<any> {
		const code = this.getTextDocument();
		if (code) {
			const result = this.parser.validate(code);
			return Promise.resolve(result);
		}
		return Promise.resolve([]);
	}

	private getTextDocument(): string {
		const model = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
		return model.getValue();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): HiveSQLWorker {
	return new HiveSQLWorker(ctx, createData);
}
