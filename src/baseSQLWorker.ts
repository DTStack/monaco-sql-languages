import BasicParser from 'dt-sql-parser/dist/parser/common/basicParser';
import { worker } from './fillers/monaco-editor-core';
import { Suggestions, ParseError } from 'dt-sql-parser';
import { Position } from './fillers/monaco-editor-core';

export abstract class BaseSQLWorker {
	protected abstract _ctx: worker.IWorkerContext;
	protected abstract parser: BasicParser;
	protected keywords: string[] = [];

	async doValidation(code: string): Promise<ParseError[]> {
		code = code || this.getTextDocument();
		if (code) {
			const result = this.parser.validate(code);
			return Promise.resolve(result);
		}
		return Promise.resolve([]);
	}

	async valid(code: string): Promise<ParseError[]> {
		if (code) {
			const result = this.parser.validate(code);
			return Promise.resolve(result);
		}
		return Promise.resolve([]);
	}

	async parserTreeToString(code: string): Promise<string> {
		if (code) {
			const parser = this.parser.createParser(code);
			const parseTree = parser.program();
			const result = parseTree.toStringTree();
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
