import { languages } from 'monaco-editor/esm/vs/editor/editor.api';
import {
	CommonEntityContext,
	CompletionService,
	ICompletionItem,
	Suggestions,
	WordRange
} from 'monaco-sql-languages/esm/languageService';
import { EntityContextType, StmtContextType } from 'monaco-sql-languages/esm/main';

import {
	getCatalogs,
	getDataBases,
	getSchemas,
	getTables,
	getViews,
	getColumns
} from './dbMetaProvider';
import {
	AttrName,
	ColumnDeclareType,
	EntityContext,
	TableDeclareType
} from 'dt-sql-parser/dist/parser/common/entityCollector';

// Custom completion item interface, extending ICompletionItem to support additional properties
interface EnhancedCompletionItem extends ICompletionItem {
	_tableName?: string;
	_columnText?: string;
}

const haveCatalogSQLType = (languageId: string) => {
	return ['flinksql', 'trinosql'].includes(languageId.toLowerCase());
};

const namedSchemaSQLType = (languageId: string) => {
	return ['trinosql', 'hivesql', 'sparksql'].includes(languageId);
};

const isWordRangesEndWithWhiteSpace = (wordRanges: WordRange[]) => {
	return wordRanges.length > 1 && wordRanges.at(-1)?.text === ' ';
};

// Completion tracker class, used to track already added completion types
class CompletionTracker {
	private completionTypes = new Set<string>();

	hasCompletionType(type: string): boolean {
		return this.completionTypes.has(type);
	}

	markAsCompleted(type: string): void {
		this.completionTypes.add(type);
	}
}

/**
 * Get database object completion items (catalog, database, table, etc.)
 */
const getDatabaseObjectCompletions = async (
	tracker: CompletionTracker,
	languageId: string,
	contextType: EntityContextType | StmtContextType,
	words: string[]
): Promise<ICompletionItem[]> => {
	const haveCatalog = haveCatalogSQLType(languageId);
	const getDBOrSchema = namedSchemaSQLType(languageId) ? getSchemas : getDataBases;
	const wordCount = words.length;
	const result: ICompletionItem[] = [];

	// Complete Catalog
	if (wordCount <= 1 && haveCatalog && !tracker.hasCompletionType('catalog')) {
		if (
			[EntityContextType.CATALOG, EntityContextType.DATABASE_CREATE].includes(
				contextType as EntityContextType
			)
		) {
			result.push(...(await getCatalogs(languageId)));
			tracker.markAsCompleted('catalog');
		}
	}

	// Complete Database
	if (wordCount <= 1 && !tracker.hasCompletionType('database')) {
		if (
			[
				EntityContextType.DATABASE,
				EntityContextType.TABLE,
				EntityContextType.TABLE_CREATE,
				EntityContextType.VIEW,
				EntityContextType.VIEW_CREATE
			].includes(contextType as EntityContextType)
		) {
			result.push(...(await getDBOrSchema(languageId)));
			tracker.markAsCompleted('database');
		}
	}

	// Complete Database under Catalog
	if (
		wordCount >= 2 &&
		wordCount <= 3 &&
		haveCatalog &&
		!tracker.hasCompletionType('database_in_catalog')
	) {
		if (
			[
				EntityContextType.DATABASE,
				EntityContextType.TABLE,
				EntityContextType.TABLE_CREATE,
				EntityContextType.VIEW,
				EntityContextType.VIEW_CREATE
			].includes(contextType as EntityContextType)
		) {
			result.push(...(await getDBOrSchema(languageId, words[0])));
			tracker.markAsCompleted('database_in_catalog');
		}
	}

	// Complete Table
	if (
		contextType === EntityContextType.TABLE &&
		wordCount <= 1 &&
		!tracker.hasCompletionType('table')
	) {
		result.push(...(await getTables(languageId)));
		tracker.markAsCompleted('table');
	}

	// Complete Tables under Database
	if (
		contextType === EntityContextType.TABLE &&
		wordCount >= 2 &&
		wordCount <= 3 &&
		!tracker.hasCompletionType('table_in_database')
	) {
		result.push(...(await getTables(languageId, undefined, words[0])));
		tracker.markAsCompleted('table_in_database');
	}

	// Complete Tables under Catalog.Database
	if (
		contextType === EntityContextType.TABLE &&
		wordCount >= 4 &&
		wordCount <= 5 &&
		haveCatalog &&
		!tracker.hasCompletionType('table_in_catalog_database')
	) {
		result.push(...(await getTables(languageId, words[0], words[2])));
		tracker.markAsCompleted('table_in_catalog_database');
	}

	// Complete View
	if (
		contextType === EntityContextType.VIEW &&
		wordCount <= 1 &&
		!tracker.hasCompletionType('view')
	) {
		result.push(...(await getViews(languageId)));
		tracker.markAsCompleted('view');
	}

	// Complete Views under Database
	if (
		contextType === EntityContextType.VIEW &&
		wordCount >= 2 &&
		wordCount <= 3 &&
		!tracker.hasCompletionType('view_in_database')
	) {
		result.push(...(await getViews(languageId, undefined, words[0])));
		tracker.markAsCompleted('view_in_database');
	}

	// Complete Views under Catalog.Database
	if (
		contextType === EntityContextType.VIEW &&
		wordCount >= 4 &&
		wordCount <= 5 &&
		!tracker.hasCompletionType('view_in_catalog_database')
	) {
		result.push(...(await getViews(languageId, words[0], words[2])));
		tracker.markAsCompleted('view_in_catalog_database');
	}

	return result;
};

/**
 * Parse entity text and extract different parts
 * @param originEntityText - The origin entity text
 * @returns Parsed entity information
 * @example
 * parseEntityText('catalog.database.table') => { catalog: 'catalog', schema: 'database', table: 'table', fullPath: 'catalog.database.table' }
 * parseEntityText('schema.table') => { catalog: null, schema: 'schema', table: 'table', fullPath: 'schema.table' }
 * parseEntityText('table') => { catalog: null, schema: null, table: 'table', fullPath: 'table' }
 */
const parseEntityText = (originEntityText: string) => {
	// Use regex to split correctly, keeping backtick-wrapped parts as a whole.
	// Match: backtick-wrapped content (including internal dots) or regular non-dot characters.
	// '`xx.xx`' should be treated as a whole word `xx.xx`.
	const regex = /`[^`]+`|[^.]+/g;
	const matches = originEntityText.match(regex) || [];

	const words = matches.map((word) => {
		if (word.startsWith('`') && word.endsWith('`') && word.length >= 3) {
			const content = word.slice(1, -1);
			// Only remove backticks when content contains only letters, numbers, and underscores
			if (/^[a-zA-Z0-9_]+$/.test(content)) {
				return content;
			}
		}
		return word;
	});

	const length = words.length;
	if (length >= 3) {
		// catalog.schema.table format
		return {
			catalog: words[0],
			schema: words[1],
			table: words[2],
			fullPath: words.join('.'),
			pureEntityText: words[2]
		};
	} else if (length === 2) {
		// schema.table format
		return {
			catalog: null,
			schema: words[0],
			table: words[1],
			fullPath: words.join('.'),
			pureEntityText: words[1]
		};
	} else {
		// table format
		return {
			catalog: null,
			schema: null,
			table: words[0],
			fullPath: words[0],
			pureEntityText: words[0]
		};
	}
};

/**
 * Get the pure entity text from the origin entity text
 * @param originEntityText - The origin entity text
 * @returns The pure entity text
 * @example
 * getPureEntityText('catalog.database.table') => 'table'
 * getPureEntityText('tb.id') => 'id'
 * getPureEntityText('`a1`') => 'a1'
 */
const getPureEntityText = (originEntityText: string) => {
	return parseEntityText(originEntityText).pureEntityText;
};

/**
 * Remove backticks from text for filter matching
 * @param text - The text that may contain backticks
 * @returns The text without backticks
 */
const removeBackticks = (text: string): string => {
	return text.replace(/`/g, '');
};

/**
 * Check if two entity paths match, considering schema information
 * @param createTablePath - The path from CREATE TABLE statement
 * @param referenceTablePath - The path from table reference
 * @returns Whether the paths match
 */
const isEntityPathMatch = (createTablePath: string, referenceTablePath: string): boolean => {
	const createInfo = parseEntityText(createTablePath);
	const refInfo = parseEntityText(referenceTablePath);

	// Exact match
	if (createInfo.fullPath === refInfo.fullPath) {
		return true;
	}

	// If reference has no schema but table name matches
	if (!refInfo.schema && createInfo.table === refInfo.table) {
		return true;
	}

	// If both have schema and table, they must match exactly
	if (createInfo.schema && refInfo.schema) {
		return createInfo.schema === refInfo.schema && createInfo.table === refInfo.table;
	}

	return false;
};

/**
 * Process column completions, including regular columns and table.column format
 */
const getColumnCompletions = async (
	languageId: string,
	wordRanges: WordRange[],
	entities: EntityContext[] | null
): Promise<ICompletionItem[]> => {
	if (!entities) return [];

	const words = wordRanges.map((wr) => wr.text);
	const result: ICompletionItem[] = [];

	// All tables defined in the context
	const allTableDefinitionEntities =
		(entities?.filter(
			(entity) => entity.entityContextType === EntityContextType.TABLE_CREATE
		) as CommonEntityContext[]) || [];

	// Source tables in the SELECT statement
	const sourceTables =
		(entities?.filter(
			(entity) => entity.entityContextType === EntityContextType.TABLE && entity.isAccessible
		) as CommonEntityContext[]) || [];

	// Find table definitions from source tables (regular CREATE TABLE with explicit columns)
	const sourceTableDefinitionEntities = allTableDefinitionEntities.filter((createTable) =>
		sourceTables?.some(
			(sourceTable) =>
				sourceTable.declareType === TableDeclareType.LITERAL &&
				isEntityPathMatch(createTable.text, sourceTable.text)
		)
	);

	// Find CTAS table definitions from source tables (CREATE TABLE AS SELECT)
	const ctasTableDefinitionEntities = allTableDefinitionEntities.filter((createTable) =>
		sourceTables?.some(
			(sourceTable) =>
				sourceTable.declareType === TableDeclareType.LITERAL &&
				// Check if the CREATE TABLE has relatedEntities with QUERY_RESULT (indicates CTAS)
				createTable.relatedEntities?.some(
					(relatedEntity) =>
						relatedEntity.entityContextType === EntityContextType.QUERY_RESULT
				) &&
				isEntityPathMatch(createTable.text, sourceTable.text)
		)
	);

	const derivedTableEntities =
		sourceTables?.filter((entity) => entity.declareType === TableDeclareType.EXPRESSION) || [];

	const tableNameAliasMap: Record<string, string> = sourceTables.reduce(
		(acc: Record<string, string>, tb) => {
			const alias = tb[AttrName.alias]?.text;
			if (alias) {
				acc[tb.text] = alias;
			}
			return acc;
		},
		{}
	);

	// alias to full table path
	const aliasToTableMap: Record<string, string> = Object.fromEntries(
		Object.entries(tableNameAliasMap).map(([tablePath, alias]) => [alias, tablePath])
	);

	// When not typing a dot, suggest all source tables and columns (if source tables are directly created in local context)
	if (wordRanges.length <= 1) {
		const columnRepeatCountMap = new Map<string, number>();

		// Get columns from local tables
		let sourceTableColumns: EnhancedCompletionItem[] = [];

		sourceTables.forEach((sourceTable) => {
			const realTablePath = sourceTable.text;
			const displayAlias = tableNameAliasMap[sourceTable.text];

			const tableColumns = [
				...getSpecificTableColumns(
					sourceTableDefinitionEntities,
					realTablePath,
					displayAlias
				),
				...getSpecificDerivedTableColumns(derivedTableEntities, displayAlias),
				...getSpecificCTASTableColumns(
					ctasTableDefinitionEntities,
					realTablePath,
					displayAlias
				)
			];

			sourceTableColumns.push(...tableColumns);
		});

		// Count duplicate column names
		sourceTableColumns.forEach((col) => {
			if (col._columnText) {
				const repeatCount = columnRepeatCountMap.get(col._columnText) || 0;
				columnRepeatCountMap.set(col._columnText, repeatCount + 1);
			}
		});

		// If there are columns with the same name, automatically include table name in inserted text
		sourceTableColumns = sourceTableColumns.map((column) => {
			const columnRepeatCount = columnRepeatCountMap.get(column._columnText as string) || 0;
			const isIncludeInMultipleTables = sourceTables.length > 1;
			if (columnRepeatCount > 1 && isIncludeInMultipleTables) {
				const newLabel = `${column._tableName}.${column.label}`;
				return {
					...column,
					label: newLabel,
					filterText: removeBackticks(newLabel),
					insertText: `${column._tableName}.${column._columnText}`
				};
			}
			return column;
		});

		result.push(...sourceTableColumns);

		// Also suggest tables when inputting column
		const tableCompletionItems =
			sourceTables.length > 1
				? sourceTables.map((tb) => {
						const tableName = tb[AttrName.alias]?.text ?? getPureEntityText(tb.text);
						return {
							label: tableName,
							filterText: removeBackticks(tableName),
							kind: languages.CompletionItemKind.Field,
							detail:
								tb.declareType === TableDeclareType.LITERAL
									? 'table'
									: 'derived table',
							sortText: '1' + tableName
						};
					})
				: [];

		result.push(...tableCompletionItems);
	} else if (wordRanges.length === 2 && words[1] === '.') {
		// Table.column format completion
		const tbNameOrAlias = words[0];

		let realTablePath = tbNameOrAlias;

		// Check if the input is an alias and resolve to full table path
		if (aliasToTableMap[tbNameOrAlias]) {
			realTablePath = aliasToTableMap[tbNameOrAlias];
		} else {
			// Try to find matching table in source tables (handles partial schema references)
			const matchingTable = sourceTables.find((tb) => {
				const parsedTable = parseEntityText(tb.text);
				// Check if input matches table name or schema.table pattern
				return (
					parsedTable.table === tbNameOrAlias ||
					parsedTable.fullPath === tbNameOrAlias ||
					tb.text === tbNameOrAlias
				);
			});

			if (matchingTable) {
				realTablePath = matchingTable.text;
			}
		}

		// Find columns in local table definitions
		const displayAlias = aliasToTableMap[tbNameOrAlias] ? tbNameOrAlias : undefined;

		const localTableColumns = [
			...getSpecificTableColumns(sourceTableDefinitionEntities, realTablePath, displayAlias),
			...getSpecificDerivedTableColumns(derivedTableEntities, displayAlias),
			...getSpecificCTASTableColumns(ctasTableDefinitionEntities, realTablePath, displayAlias)
		];

		result.push(...localTableColumns);

		// If no local table columns found, try to fetch from cloud
		if (localTableColumns.length === 0) {
			// Check if this table is locally created
			const isLocallyCreatedTable = allTableDefinitionEntities.some((createTable) => {
				return isEntityPathMatch(createTable.text, realTablePath);
			});

			const isLiteralTable = sourceTables.some(
				(tb) =>
					tb.declareType === TableDeclareType.LITERAL &&
					(tb.text === realTablePath || isEntityPathMatch(tb.text, realTablePath))
			);

			// Only fetch from remote if table is not locally created
			if (!isLocallyCreatedTable && isLiteralTable) {
				const remoteColumns = await getColumns(languageId, realTablePath);
				result.push(...remoteColumns);
			}
		}
	}

	return result;
};

/**
 * Get columns from a specific table
 */
const getSpecificTableColumns = (
	sourceTableDefinitionEntities: CommonEntityContext[],
	realTablePath: string,
	displayAlias?: string
): ICompletionItem[] => {
	return sourceTableDefinitionEntities
		.filter((tb) => {
			return (
				tb.text === realTablePath ||
				isEntityPathMatch(tb.text, realTablePath) ||
				getPureEntityText(tb.text) === getPureEntityText(realTablePath)
			);
		})
		.map((tb) => {
			const tableName = displayAlias || getPureEntityText(tb.text);
			return (
				tb.columns?.map((column) => {
					const columnName =
						column[AttrName.alias]?.text || getPureEntityText(column.text);
					const label =
						columnName +
						(column[AttrName.colType]?.text
							? `(${column[AttrName.colType].text})`
							: '');
					return {
						label,
						filterText: removeBackticks(label),
						insertText: columnName,
						kind: languages.CompletionItemKind.EnumMember,
						detail: `\`${tableName}\`'s column`,
						sortText: '0' + tableName + columnName,
						_columnText: columnName,
						_tableName: tableName
					};
				}) || []
			);
		})
		.flat();
};

/**
 * Get columns from a specific derived table (subquery)
 */
const getSpecificDerivedTableColumns = (
	derivedTableEntities: CommonEntityContext[],
	displayAlias?: string
): ICompletionItem[] => {
	return derivedTableEntities
		.filter((tb) => {
			return displayAlias ? tb[AttrName.alias]?.text === displayAlias : false;
		})
		.map((tb) => {
			const derivedTableQueryResult = tb.relatedEntities?.find(
				(entity) => entity.entityContextType === EntityContextType.QUERY_RESULT
			) as CommonEntityContext | undefined;

			const tableName =
				displayAlias || tb[AttrName.alias]?.text || getPureEntityText(tb.text);

			return (
				derivedTableQueryResult?.columns
					?.filter((column) => column.declareType !== ColumnDeclareType.ALL)
					.map((column) => {
						const columnName =
							column[AttrName.alias]?.text || getPureEntityText(column.text);
						return {
							label: columnName,
							filterText: removeBackticks(columnName),
							insertText: columnName,
							kind: languages.CompletionItemKind.EnumMember,
							detail: `\`${tableName}\`'s column`,
							sortText: '0' + tableName + columnName,
							_columnText: columnName,
							_tableName: tableName
						};
					}) || []
			);
		})
		.flat();
};

/**
 * Get columns from a specific CTAS table
 */
const getSpecificCTASTableColumns = (
	ctasTableEntities: CommonEntityContext[],
	realTablePath: string,
	displayAlias?: string
): ICompletionItem[] => {
	return ctasTableEntities
		.filter((tb) => {
			return (
				tb.text === realTablePath ||
				isEntityPathMatch(tb.text, realTablePath) ||
				getPureEntityText(tb.text) === getPureEntityText(realTablePath)
			);
		})
		.map((tb) => {
			const ctasQueryResult = tb.relatedEntities?.find(
				(entity) => entity.entityContextType === EntityContextType.QUERY_RESULT
			) as CommonEntityContext | undefined;

			const tableName = displayAlias || getPureEntityText(tb.text);

			return (
				ctasQueryResult?.columns
					?.filter((column) => column.declareType !== ColumnDeclareType.ALL)
					.map((column) => {
						const columnName =
							column[AttrName.alias]?.text || getPureEntityText(column.text);
						const label =
							columnName +
							(column[AttrName.colType]?.text
								? `(${column[AttrName.colType].text})`
								: '');
						return {
							label,
							filterText: removeBackticks(label),
							insertText: columnName,
							kind: languages.CompletionItemKind.EnumMember,
							detail: `\`${tableName}\`'s column`,
							sortText: '0' + tableName + columnName,
							_columnText: columnName,
							_tableName: tableName
						};
					}) || []
			);
		})
		.flat();
};

const getSyntaxCompletionItems = async (
	languageId: string,
	syntax: Suggestions['syntax'],
	entities: EntityContext[] | null
): Promise<ICompletionItem[]> => {
	const tracker = new CompletionTracker();
	let syntaxCompletionItems: ICompletionItem[] = [];

	for (let i = 0; i < syntax.length; i++) {
		const { syntaxContextType, wordRanges } = syntax[i];
		const words = wordRanges.map((wr) => wr.text);

		// If already typed a space, we've left that context
		if (isWordRangesEndWithWhiteSpace(wordRanges)) continue;

		if (
			[
				EntityContextType.CATALOG,
				EntityContextType.DATABASE,
				EntityContextType.DATABASE_CREATE,
				EntityContextType.TABLE,
				EntityContextType.TABLE_CREATE,
				EntityContextType.VIEW,
				EntityContextType.VIEW_CREATE
			].includes(syntaxContextType as EntityContextType) &&
			!tracker.hasCompletionType('db_objects')
		) {
			// Get database object completions (catalog, database, table, etc.)
			const dbObjectCompletions = await getDatabaseObjectCompletions(
				tracker,
				languageId,
				syntaxContextType,
				words
			);

			syntaxCompletionItems = syntaxCompletionItems.concat(dbObjectCompletions);
			tracker.markAsCompleted('db_objects');
		}

		// Add table completions from table entities created in context
		if (
			syntaxContextType === EntityContextType.TABLE &&
			words.length <= 1 &&
			!tracker.hasCompletionType('created_tables')
		) {
			const createTables =
				entities
					?.filter(
						(entity) => entity.entityContextType === EntityContextType.TABLE_CREATE
					)
					.map((tb) => {
						const tableName = getPureEntityText(tb.text);
						return {
							label: tableName,
							filterText: removeBackticks(tableName),
							kind: languages.CompletionItemKind.Field,
							detail: 'table',
							sortText: '1' + tableName
						};
					}) || [];

			syntaxCompletionItems = syntaxCompletionItems.concat(createTables);
			tracker.markAsCompleted('created_tables');
		}

		// Process column completions
		if (
			syntaxContextType === EntityContextType.COLUMN &&
			!tracker.hasCompletionType('columns')
		) {
			const columnCompletions = await getColumnCompletions(languageId, wordRanges, entities);
			syntaxCompletionItems = syntaxCompletionItems.concat(columnCompletions);
			tracker.markAsCompleted('columns');
		}
	}

	return syntaxCompletionItems;
};

export const completionService: CompletionService = async function (
	model,
	_position,
	_completionContext,
	suggestions,
	entities,
	snippets
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
		detail: 'keyword',
		sortText: '2' + kw
	}));

	const syntaxCompletionItems = await getSyntaxCompletionItems(languageId, syntax, entities);

	const snippetCompletionItems: ICompletionItem[] =
		snippets?.map((item) => ({
			label: item.label || item.prefix,
			kind: languages.CompletionItemKind.Snippet,
			filterText: item.prefix,
			insertText: item.insertText,
			insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
			sortText: '3' + item.prefix,
			detail: item.description !== undefined ? item.description : 'SQL模板',
			documentation: item.insertText
		})) || [];

	return [...syntaxCompletionItems, ...keywordsCompletionItems, ...snippetCompletionItems];
};
