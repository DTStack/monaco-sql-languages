import { worker } from 'monaco-editor';
import { SparkSQL } from 'dt-sql-parser';
import { ICreateData } from '../_.contribution';

export class SparkSQLWorker {
	private _ctx: worker.IWorkerContext;
	private parser: typeof SparkSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this.parser = new SparkSQL();
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

export function create(ctx: worker.IWorkerContext, createData: ICreateData): SparkSQLWorker {
	return new SparkSQLWorker(ctx, createData);
}
