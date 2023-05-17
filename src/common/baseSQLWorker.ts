import { worker } from 'monaco-editor';

export abstract class BaseSQLWorker {
	protected abstract _ctx: worker.IWorkerContext;
	protected abstract parser: any;

	async doValidation(code: string): Promise<any> {
		code = code || this.getTextDocument();
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

	async autocomplete(code: string, position: any): Promise<any> {}

	private getTextDocument(): string {
		const model = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
		return model && model.getValue();
	}
}
