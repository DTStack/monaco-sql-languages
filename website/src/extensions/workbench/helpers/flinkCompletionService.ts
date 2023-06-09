import { CompletionService, ICompletionItem } from 'monaco-sql-languages/out/esm/languageService';
import { languages } from 'monaco-editor';
import { SyntaxContextType } from 'monaco-sql-languages/out/esm/monaco.contribution';

export const flinkCompletionService: CompletionService = async function (
	_model,
	_position,
	_completionContext,
	suggestions
) {
	if (!suggestions) {
		return Promise.resolve([]);
	}
	const { keywords, syntax } = suggestions;
	const keywordsCompletionItems: ICompletionItem[] = keywords.map((kw) => ({
		label: kw,
		kind: languages.CompletionItemKind.Keyword,
		detail: '关键字',
		sortText: '2' + kw
	}));

	let syntaxCompletionItems: ICompletionItem[] = [];

	for (let i = 0; i < syntax.length; i++) {
		const { syntaxContextType, wordRanges } = syntax[i];

		const words = wordRanges.map((wr) => wr.text);

		if (syntaxContextType === SyntaxContextType.CATALOG) {
			if (words.length === 0 || words.length === 1) {
				const catalogCompletions = await getCatalogs();
				syntaxCompletionItems = [...syntaxCompletionItems, ...catalogCompletions];
			}
		}

		if (syntaxContextType === SyntaxContextType.DATABASE) {
			if (
				words.length === 0 ||
				(words.length === 1 &&
					syntax.every((st) => st.syntaxContextType !== SyntaxContextType.CATALOG))
			) {
				const catalogCompletions = await getCatalogs();
				syntaxCompletionItems = [...syntaxCompletionItems, ...catalogCompletions];
			}
			if (words.length === 2 || words.length === 3) {
				const databaseCompletions = await getDataBases(words[0]);
				syntaxCompletionItems = [...syntaxCompletionItems, ...databaseCompletions];
			}
		}

		if (syntaxContextType === SyntaxContextType.TABLE) {
			if (
				words.length === 0 ||
				(words.length === 1 &&
					syntax.every((st) => st.syntaxContextType !== SyntaxContextType.CATALOG))
			) {
				const catalogCompletions = await getCatalogs();
				const tmpTableCompletions = await getTmpTable();
				syntaxCompletionItems = [
					...syntaxCompletionItems,
					...tmpTableCompletions,
					...catalogCompletions
				];
			}
			if (
				words.length === 2 ||
				(words.length === 3 &&
					syntax.every((st) => st.syntaxContextType !== SyntaxContextType.DATABASE))
			) {
				const databaseCompletions = await getDataBases(words[0]);
				syntaxCompletionItems = [...syntaxCompletionItems, ...databaseCompletions];
			}
			if (words.length === 4 || words.length === 5) {
				const tableCompletions = await getTables(words[0], words[2]);
				syntaxCompletionItems = [...syntaxCompletionItems, ...tableCompletions];
			}
		}
	}
	return [...syntaxCompletionItems, ...keywordsCompletionItems];
};

const catalogs = ['cat1', 'cat2', 'cat3'];

/**
 * 获取所有的 catalog
 */
function getCatalogs() {
	const catCompletions = catalogs.map((cat) => ({
		label: cat,
		kind: languages.CompletionItemKind.Field,
		detail: 'catalog',
		sortText: '1' + cat
	}));
	return Promise.resolve(catCompletions);
}

const databases = ['db1', 'db2', 'db3'];

/**
 * 根据catalog 获取 database
 */
function getDataBases(catalog: string) {
	const exist = catalogs.includes(catalog);
	if (exist) {
		const dbs = databases.map((db) => `${catalog}_${db}`);
		const dbsCompletions = dbs.map((db) => ({
			label: db,
			kind: languages.CompletionItemKind.Field,
			detail: 'database',
			sortText: '1' + db
		}));
		return Promise.resolve(dbsCompletions);
	} else {
		return Promise.resolve([]);
	}
}

const tables = ['tb1', 'tb2', 'tb3'];

/**
 * 根据 catalog 和 database 获取 table
 */
function getTables(catalog: string, database: string) {
	const tbs = tables.map((tb) => `${catalog}_${database}_${tb}`);
	const tableCompletions = tbs.map((tb) => ({
		label: tb,
		kind: languages.CompletionItemKind.Field,
		detail: 'table',
		sortText: '1' + tb
	}));
	return Promise.resolve(tableCompletions);
}

const tmpTables = ['tmptb1', 'tmptb2', 'tmptb3'];
/**
 * 获取临时表
 */
function getTmpTable() {
	const tableCompletions = tmpTables.map((tb) => ({
		label: tb,
		kind: languages.CompletionItemKind.Field,
		detail: 'table',
		sortText: '1' + tb
	}));
	return Promise.resolve(tableCompletions);
}
