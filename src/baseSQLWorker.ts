import { BasicSQL } from 'dt-sql-parser/dist/parser/common/basicSQL';
import { worker } from './fillers/monaco-editor-core';
import { Suggestions, ParseError, EntityContext } from 'dt-sql-parser';
import { Position } from './fillers/monaco-editor-core';

export interface ICreateData {
	languageId: string;
}

export abstract class BaseSQLWorker {
	protected abstract _ctx: worker.IWorkerContext;
	protected abstract parser: BasicSQL;
	protected keywords: string[] = [];

	constructor(_ctx: worker.IWorkerContext, _createData: ICreateData) {}

	async doValidation(code: string): Promise<ParseError[]> {
		code = code || this.getTextDocument();
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
			const result = parseTree.toStringTree(parser);
			return Promise.resolve(result);
		}
		return Promise.resolve('');
	}

	async doCompletion(code: string, position: Position): Promise<Suggestions | null> {
		code = code || this.getTextDocument();
		if (code) {
			const suggestions = this.parser.getSuggestionAtCaretPosition(code, position);
			return Promise.resolve(suggestions);
		}
		return Promise.resolve(null);
	}

	async doCompletionWithEntities(
		code: string,
		position: Position
	): Promise<[Suggestions | null, EntityContext[] | null]> {
		code = code || this.getTextDocument();
		if (code) {
			const suggestions = this.parser.getSuggestionAtCaretPosition(code, position);
			let allEntities = null;
			if (suggestions?.syntax?.length) {
				allEntities = this.parser.getAllEntities(code, position);
			}
			return Promise.resolve([suggestions, allEntities]);
		}
		return Promise.resolve([null, null]);
	}

	async getAllEntities(code: string, position?: Position): Promise<EntityContext[] | null> {
		code = code || this.getTextDocument();
		if (code) {
			const allEntities = this.parser.getAllEntities(code, position);
			return Promise.resolve(allEntities);
		}
		return Promise.resolve(null);
	}

	private getTextDocument(): string {
		const model = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
		return model && model.getValue();
	}
}
