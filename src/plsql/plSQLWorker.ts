import { worker } from 'monaco-editor';
import PLSQL from 'dt-sql-parser/dist/parser/plsql';
import { ICreateData } from '../_.contribution';

export class PLSQLWorker {
	private _ctx: worker.IWorkerContext;
	private parser: PLSQL;
	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this.parser = new PLSQL();
	}

	async doValidation(uri: string): Promise<any> {
		const code = this.getTextDocument();
		if (code) {
			const result = this.parser.validate(code);
			return Promise.resolve(result);
		}
		return Promise.resolve([]);
	}

	async valid(code: string): Promise<any> {
		if (code) {
			const result = this.parser.validate(code);
			return Promise.resolve(result);
		}
		return Promise.resolve([]);
	}

	async parserTreeToString(code: string): Promise<any> {
		if (code) {
			const result = this.parser.parserTreeToString(code);
			return Promise.resolve(result);
		}
		return Promise.resolve([]);
	}

	private getTextDocument(): string {
		const model = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
		return model.getValue();
	}
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): PLSQLWorker {
	return new PLSQLWorker(ctx, createData);
}
