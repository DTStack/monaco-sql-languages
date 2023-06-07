import BasicParser from 'dt-sql-parser/dist/parser/common/basicParser';
import { worker } from './fillers/monaco-editor-core';
import { Suggestions, ParserError } from 'dt-sql-parser';
import { Position } from './fillers/monaco-editor-core';

export abstract class BaseSQLWorker {
	protected abstract _ctx: worker.IWorkerContext;
	protected abstract parser: BasicParser;
	protected keywords: string[] = [];

	async doValidation(code: string): Promise<ParserError[]> {
		code = code || this.getTextDocument();
		if (code) {
			const result = this.parser.validate(code);
			return Promise.resolve(result);
		}
		return Promise.resolve([]);
	}

	async valid(code: string): Promise<ParserError[]> {
		if (code) {
			const result = this.parser.validate(code);
			return Promise.resolve(result);
		}
		return Promise.resolve([]);
	}

	async parserTreeToString(code: string): Promise<string> {
		if (code) {
			const result = this.parser.parserTreeToString(code);
			return Promise.resolve(result);
		}
		return Promise.resolve('');
	}

	async doComplete(code: string, position: Position): Promise<Suggestions | null> {
		code = code || this.getTextDocument();
		if (code) {
			const suggestions = this.parser.getSuggestionAtCaretPosition(code, position);
			return Promise.resolve(suggestions);
		}
		return Promise.resolve(null);
	}

	private getTextDocument(): string {
		const model = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
		return model && model.getValue();
	}
}
