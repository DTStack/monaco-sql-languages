import { BasicSQL } from 'dt-sql-parser/dist/parser/common/basicSQL';
import { worker } from './fillers/monaco-editor-core';
import { Suggestions, ParseError, EntityContext } from 'dt-sql-parser';
import { Position } from './fillers/monaco-editor-core';
import type { SerializedTreeNode } from './languageService';

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

	async getSerializedParseTree(code: string): Promise<SerializedTreeNode | null> {
		if (!code) return Promise.resolve(null);

		const parser = this.parser.createParser(code);
		const parseTree = parser.program();
		const ruleNames = parser.ruleNames;
		const tokenTypeMap = parser.getTokenTypeMap();
		const tokenNameMap = new Map();

		for (const [name, tokenType] of tokenTypeMap.entries()) {
			tokenNameMap.set(tokenType, name);
		}

		// 只保留必要信息, 避免worker通信传输失败
		function serializeNode(node: any): SerializedTreeNode | null {
			if (!node) return null;

			const isRuleNode = !node.symbol;

			const serializedNode: SerializedTreeNode = {
				ruleName: isRuleNode ? ruleNames[node.ruleIndex] : node.constructor.name,
				text: isRuleNode
					? ''
					: tokenNameMap.get(node.symbol.tokenSource?.type) + ': ' + node.symbol.text,
				children: []
			};

			for (let i = 0; i < node.getChildCount(); i++) {
				const child = node.getChild(i);
				if (child) {
					serializedNode.children.push(serializeNode(child)!);
				}
			}

			return serializedNode;
		}

		return Promise.resolve(serializeNode(parseTree));
	}

	private getTextDocument(): string {
		const model = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
		return model && model.getValue();
	}
}
