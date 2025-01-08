import { languages } from 'monaco-editor/esm/vs/editor/editor.api';
import {
	CommonEntityContext,
	CompletionService,
	ICompletionItem,
	Suggestions,
	WordRange
} from 'monaco-sql-languages/esm/languageService';
import { EntityContextType } from 'monaco-sql-languages/esm/main';

import { getCatalogs, getDataBases, getSchemas, getTables, getViews } from './dbMetaProvider';
import { AttrName, EntityContext } from 'dt-sql-parser/dist/parser/common/entityCollector';

const haveCatalogSQLType = (languageId: string) => {
	return ['flinksql', 'trinosql'].includes(languageId.toLowerCase());
};

const namedSchemaSQLType = (languageId: string) => {
	return ['trinosql', 'hivesql', 'sparksql'].includes(languageId);
};

const isWordRangesEndWithWhiteSpace = (wordRanges: WordRange[]) => {
	return wordRanges.length > 1 && wordRanges.at(-1)?.text === ' ';
};

const getSyntaxCompletionItems = async (
	languageId: string,
	syntax: Suggestions['syntax'],
	entities: EntityContext[] | null
): Promise<ICompletionItem[]> => {
	const haveCatalog = haveCatalogSQLType(languageId);
	const getDBOrSchema = namedSchemaSQLType(languageId) ? getSchemas : getDataBases;

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

		/**
		 * 在做上下文判断时，如果已经键入了空格，则表示已经离开了该上下文。
		 * 如: SELECT id  |  FROM t1
		 * 光标所处位置在id后且键入了空格，虽然收集到的上下文信息中包含了`EntityContextType.COLUMN`，但不应该继续补全字段, table同理
		 */
		if (isWordRangesEndWithWhiteSpace(wordRanges)) continue;

		if (
			syntaxContextType === EntityContextType.CATALOG ||
			syntaxContextType === EntityContextType.DATABASE_CREATE
		) {
			if (!existCatalogCompletions && wordCount <= 1) {
				syntaxCompletionItems = syntaxCompletionItems.concat(await getCatalogs(languageId));
				existCatalogCompletions = true;
			}
		}

		if (
			syntaxContextType === EntityContextType.DATABASE ||
			syntaxContextType === EntityContextType.TABLE_CREATE ||
			syntaxContextType === EntityContextType.VIEW_CREATE
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

		if (syntaxContextType === EntityContextType.TABLE) {
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
					const createTables =
						entities
							?.filter(
								(entity) =>
									entity.entityContextType === EntityContextType.TABLE_CREATE
							)
							.map((tb) => ({
								label: tb.text,
								kind: languages.CompletionItemKind.Field,
								detail: 'table',
								sortText: '1' + tb.text
							})) || [];
					syntaxCompletionItems = syntaxCompletionItems.concat(
						await getTables(languageId),
						createTables
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

		if (syntaxContextType === EntityContextType.VIEW) {
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

		if (syntaxContextType === EntityContextType.COLUMN) {
			const inSelectStmtContext = entities?.some(
				(entity) =>
					entity.entityContextType === EntityContextType.TABLE &&
					entity.belongStmt.isContainCaret
			);
			// 上下文中建的所有表
			const allCreateTables =
				(entities?.filter(
					(entity) => entity.entityContextType === EntityContextType.TABLE_CREATE
				) as CommonEntityContext[]) || [];

			if (inSelectStmtContext) {
				// select语句中的来源表
				// todo filter 子查询中的表
				const fromTables =
					entities?.filter(
						(entity) =>
							entity.entityContextType === EntityContextType.TABLE &&
							entity.belongStmt.isContainCaret
					) || [];
				// 从上下文中找到来源表的定义信息
				const fromTableDefinitionEntities = allCreateTables.filter((tb) =>
					fromTables?.some((ft) => ft.text === tb.text)
				);
				const tableNameAliasMap = fromTableDefinitionEntities.reduce(
					(acc: Record<string, string>, tb) => {
						acc[tb.text] =
							fromTables?.find((ft) => ft.text === tb.text)?.[AttrName.alias]?.text ||
							tb.text;
						return acc;
					},
					{}
				);

				let fromTableColumns: (ICompletionItem & {
					_tableName?: string;
					_columnText?: string;
				})[] = [];

				if (wordRanges.length <= 1) {
					const columnRepeatCountMap = new Map<string, number>();
					fromTableColumns = fromTableDefinitionEntities
						.map((tb) => {
							const displayTbName =
								tableNameAliasMap[tb.text] === tb.text
									? tb.text
									: tableNameAliasMap[tb.text];
							return (
								tb.columns?.map((column) => {
									const repeatCount = columnRepeatCountMap.get(column.text) || 0;
									columnRepeatCountMap.set(column.text, repeatCount + 1);
									return {
										label:
											column.text +
											(column[AttrName.colType]?.text
												? `(${column[AttrName.colType].text})`
												: ''),
										insertText: column.text,
										kind: languages.CompletionItemKind.EnumMember,
										detail: `来源表 ${displayTbName} 的字段`,
										sortText: '0' + displayTbName + column.text + repeatCount,
										_tableName: displayTbName,
										_columnText: column.text
									};
								}) || []
							);
						})
						.flat();

					// 如果有多个重名字段，则插入的字段自动包含表名
					fromTableColumns = fromTableColumns.map((column) => {
						const columnRepeatCount =
							columnRepeatCountMap.get(column._columnText as string) || 0;
						const isFromMultipleTables = fromTables.length > 1;
						return columnRepeatCount > 1 && isFromMultipleTables
							? {
									...column,
									label: `${column._tableName}.${column.label}`,
									insertText: `${column._tableName}.${column._columnText}`
								}
							: column;
					});

					// 输入字段时提供可选表
					const tableOrAliasCompletionItems = fromTables.map((tb) => {
						const displayTbName = tableNameAliasMap[tb.text]
							? tableNameAliasMap[tb.text]
							: tb.text;
						return {
							label: displayTbName,
							kind: languages.CompletionItemKind.Field,
							detail: `table`,
							sortText: '1' + displayTbName
						};
					});

					syntaxCompletionItems = syntaxCompletionItems.concat(
						tableOrAliasCompletionItems
					);
				} else if (wordRanges.length >= 2 && words[1] === '.') {
					const tbNameOrAlias = words[0];
					fromTableColumns = fromTableDefinitionEntities
						.filter(
							(tb) =>
								tb.text === tbNameOrAlias ||
								tableNameAliasMap[tb.text] === tbNameOrAlias
						)
						.map((tb) => {
							const displayTbName = tableNameAliasMap[tb.text]
								? tableNameAliasMap[tb.text]
								: tb.text;
							return (
								tb.columns?.map((column) => ({
									label:
										column.text +
										(column[AttrName.colType]?.text
											? `(${column[AttrName.colType].text})`
											: ''),
									insertText: column.text,
									kind: languages.CompletionItemKind.EnumMember,
									detail: `来源表 ${displayTbName} 的字段`,
									sortText: '0' + displayTbName + column.text
								})) || []
							);
						})
						.flat();
				}

				syntaxCompletionItems = syntaxCompletionItems.concat(fromTableColumns);
			}
		}
	}

	return syntaxCompletionItems;
};

export const completionService: CompletionService = async function (
	model,
	_position,
	_completionContext,
	suggestions,
	entities
) {
	if (!suggestions) {
		return Promise.resolve([]);
	}
	const languageId = model.getLanguageId();

	const { keywords, syntax } = suggestions;
	console.log('syntax', syntax);
	console.log('entities', entities);

	const keywordsCompletionItems: ICompletionItem[] = keywords.map((kw) => ({
		label: kw,
		kind: languages.CompletionItemKind.Keyword,
		detail: '关键字',
		sortText: '2' + kw
	}));

	const syntaxCompletionItems = await getSyntaxCompletionItems(languageId, syntax, entities);

	return [...syntaxCompletionItems, ...keywordsCompletionItems];
};
