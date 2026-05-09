// Type declarations for monaco-sql-languages
// This overrides the old types in esm directory

import { languages } from 'monaco-editor';
import { Position } from 'monaco-editor';

declare module 'monaco-sql-languages/esm/languageService' {
	export interface SerializedTreeNode {
		ruleName: string;
		text?: string;
		children: SerializedTreeNode[];
	}

	export class LanguageService<T = any> {
		valid(language: string, model: any): Promise<any>;
		getSerializedParseTree(language: string, model: any): Promise<SerializedTreeNode | null>;
		/** @deprecated Use getSerializedParseTree instead */
		parserTreeToString(language: string, model: any): Promise<SerializedTreeNode | null>;
		getAllEntities(language: string, model: any, position?: Position): Promise<any>;
		dispose(language?: string): void;
	}
}

declare module 'monaco-sql-languages/esm/monaco.contribution' {
	export interface ICompletionItem
		extends Omit<languages.CompletionItem, 'range' | 'insertText'> {
		label: string;
	}

	export interface ICompletionList {
		suggestions: ICompletionItem[];
		incomplete?: boolean;
		dispose?: () => void;
	}

	export type CompletionService = (
		model: any,
		position: Position,
		triggerCharacter?: string
	) => Promise<ICompletionItem[] | ICompletionList>;
}

declare module 'monaco-sql-languages/esm/main' {
	export * from 'monaco-sql-languages/esm/languageService';
	export * from 'monaco-sql-languages/esm/monaco.contribution';
	export * from 'monaco-sql-languages/esm/setupLanguageFeatures';
	export * from 'monaco-sql-languages/esm/common/constants';
	export * from 'monaco-sql-languages/esm/theme';

	export { EntityContextType, StmtContextType } from 'dt-sql-parser';

	export type {
		WordRange,
		SyntaxSuggestion,
		Suggestions,
		TextSlice,
		ParseError,
		StmtContext,
		EntityContext,
		CommonEntityContext,
		ColumnEntityContext,
		FuncEntityContext
	} from 'dt-sql-parser';
}
