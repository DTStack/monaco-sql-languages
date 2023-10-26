import { languages } from 'monaco-editor/esm/vs/editor/editor.api';
import { CompletionService, ICompletionItem } from 'monaco-sql-languages/out/esm/languageService';
import { SyntaxContextType } from 'monaco-sql-languages/out/esm/main';

import { getCatalogs, getDataBases, getSchemas, getTables, getViews } from './dbMetaProvider';

const haveCatalogSQLType = (languageId: string) => {
	return ['flinksql', 'trinosql'].includes(languageId.toLowerCase());
};

const namedSchemaSQLType = (languageId: string) => {
	return ['trinosql', 'hivesql', 'sparksql'].includes(languageId);
};

export const completionService: CompletionService = async function (
	model,
	_position,
	_completionContext,
	suggestions
) {
	if (!suggestions) {
		return Promise.resolve([]);
	}
	const languageId = model.getLanguageId();
	const haveCatalog = haveCatalogSQLType(languageId);
	const getDBOrSchema = namedSchemaSQLType(languageId) ? getSchemas : getDataBases;

	const { keywords, syntax } = suggestions;

	const keywordsCompletionItems: ICompletionItem[] = keywords.map((kw) => ({
		label: kw,
		kind: languages.CompletionItemKind.Keyword,
		detail: '关键字',
		sortText: '2' + kw
	}));

	let syntaxCompletionItems: ICompletionItem[] = [];

	/** 是否已经存在 catalog 补全项 */
	let existCatalogCompletions = false;
	/** 是否已经存在 database 补全项 tmpDatabase */
	let existDatabaseCompletions = false;
	/** 是否已经存在 database 补全项 */
	let existDatabaseInCatCompletions = false;
	/** 是否已经存在 table 补全项 tmpTable */
	let existTableCompletions = false;
	/** 是否已经存在 tableInDb 补全项 （cat.db.table） */
	let existTableInDbCompletions = false;
	/** 是否已经存在 view 补全项 tmpDb */
	let existViewCompletions = false;
	/** 是否已经存在 viewInDb 补全项  */
	let existViewInDbCompletions = false;

	for (let i = 0; i < syntax.length; i++) {
		const { syntaxContextType, wordRanges } = syntax[i];

		// e.g. words -> ['cat', '.', 'database', '.', 'table']
		const words = wordRanges.map((wr) => wr.text);
		const wordCount = words.length;

		if (
			syntaxContextType === SyntaxContextType.CATALOG ||
			syntaxContextType === SyntaxContextType.DATABASE_CREATE
		) {
			if (!existCatalogCompletions && wordCount <= 1) {
				syntaxCompletionItems = syntaxCompletionItems.concat(await getCatalogs(languageId));
				existCatalogCompletions = true;
			}
		}

		if (
			syntaxContextType === SyntaxContextType.DATABASE ||
			syntaxContextType === SyntaxContextType.TABLE_CREATE ||
			syntaxContextType === SyntaxContextType.VIEW_CREATE
		) {
			if (!existCatalogCompletions && haveCatalog && wordCount <= 1) {
				syntaxCompletionItems = syntaxCompletionItems.concat(await getCatalogs(languageId));
				existCatalogCompletions = true;
			}

			if (!existDatabaseCompletions && wordCount <= 1) {
				syntaxCompletionItems = syntaxCompletionItems.concat(
					await getDBOrSchema(languageId)
				);
				existDatabaseCompletions = true;
			}
			if (!existDatabaseInCatCompletions && haveCatalog && wordCount >= 2 && wordCount <= 3) {
				syntaxCompletionItems = syntaxCompletionItems.concat(
					await getDBOrSchema(languageId, words[0])
				);
				existDatabaseInCatCompletions = true;
			}
		}

		if (syntaxContextType === SyntaxContextType.TABLE) {
			if (wordCount <= 1) {
				if (!existCatalogCompletions && haveCatalog) {
					const ctas = await getCatalogs(languageId);
					syntaxCompletionItems = syntaxCompletionItems.concat(ctas);
					existCatalogCompletions = true;
				}

				if (!existDatabaseCompletions) {
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getDBOrSchema(languageId)
					);
					existDatabaseCompletions = true;
				}

				if (!existTableCompletions) {
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getTables(languageId)
					);
					existTableCompletions = true;
				}
			} else if (wordCount >= 2 && wordCount <= 3) {
				if (!existDatabaseInCatCompletions && haveCatalog) {
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getDBOrSchema(languageId, words[0])
					);
					existDatabaseInCatCompletions = true;
				}

				if (!existTableInDbCompletions) {
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getTables(languageId, undefined, words[0])
					);
					existTableInDbCompletions = true;
				}
			} else if (wordCount >= 4 && wordCount <= 5) {
				if (!existTableInDbCompletions) {
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getTables(languageId, words[0], words[2])
					);
					existTableInDbCompletions = true;
				}
			}
		}

		if (syntaxContextType === SyntaxContextType.VIEW) {
			if (wordCount <= 1) {
				if (!existCatalogCompletions && haveCatalog) {
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getCatalogs(languageId)
					);
					existCatalogCompletions = true;
				}

				if (!existDatabaseCompletions) {
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getDBOrSchema(languageId)
					);
					existDatabaseCompletions = true;
				}

				if (!existViewCompletions) {
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getViews(languageId)
					);
					existViewCompletions = true;
				}
			} else if (wordCount >= 2 && wordCount <= 3) {
				if (!existDatabaseInCatCompletions && haveCatalog) {
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getDBOrSchema(languageId, words[0])
					);
					existDatabaseInCatCompletions = true;
				}

				if (!existViewInDbCompletions) {
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getViews(languageId, undefined, words[0])
					);
					existViewInDbCompletions = true;
				}
			} else if (wordCount >= 4 && wordCount <= 5) {
				if (!existViewInDbCompletions) {
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getViews(languageId, words[0], words[2])
					);
					existViewInDbCompletions = true;
				}
			}
		}
	}
	return [...syntaxCompletionItems, ...keywordsCompletionItems];
};
