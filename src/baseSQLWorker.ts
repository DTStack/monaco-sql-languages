import BasicParser from 'dt-sql-parser/dist/parser/common/basicParser';
import { worker } from './fillers/monaco-editor-core';

export abstract class BaseSQLWorker {
	protected abstract _ctx: worker.IWorkerContext;
	protected abstract parser: BasicParser;
	protected keywords: string[] = [];

	private getKeywords(): string[] {
		this.keywords = this.keywords;
		if (this.keywords.length === 0) {
			const lexer = this.parser.createLexer('');
			this.keywords =
				lexer.vocabulary.symbolicNames
					.filter((keyword: string) => keyword?.startsWith('KW_'))
					.map((k: string) => k.replace('KW_', '')) || [];
		}
		return this.keywords;
	}

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

	async doComplete(code: string, position: any): Promise<any> {
		code = code || this.getTextDocument();

		if (code) {
			// TODO: going to do server side search in future, but now just get all keywords for completion
			const keywords: string[] = this.getKeywords();
			return Promise.resolve({
				items: keywords.map((i) => ({
					label: i,
					kind: 14
				}))
			});
		}
		return Promise.resolve();
	}

	private getTextDocument(): string {
		const model = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
		return model && model.getValue();
	}
}
