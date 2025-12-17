import { LanguageIdEnum } from './common/constants';
import { IDisposable, languages } from './fillers/monaco-editor-core';
import {
	CompletionOptions,
	LanguageServiceDefaults,
	LanguageServiceDefaultsImpl,
	ModeConfiguration,
	modeConfigurationDefault,
	PreprocessCode
} from './monaco.contribution';
import * as snippets from './snippets';

export interface FeatureConfiguration {
	/**
	 * Whether the built-in completionItemProvider is enabled.
	 * Defaults to true.
	 */
	completionItems?: boolean | Partial<CompletionOptions>;
	/**
	 * Whether the built-in diagnostic provider is .
	 * Defaults to true.
	 */
	diagnostics?: boolean;
	/**
	 * Defines whether the built-in definitions provider is enabled.
	 */
	definitions?: boolean;
	/**
	 * Defines whether the built-in references provider is enabled.
	 */
	references?: boolean;
	/**
	 * Defines whether the built-in hover provider is enabled.
	 */
	hover?: boolean;
	/**
	 * Define a function to preprocess code.
	 * By default, do not something.
	 */
	preprocessCode?: PreprocessCode | null;
}

const featureLoadedMap = new Map<string, boolean>();
const languageModesMap = new Map<string, IDisposable>();
const registerListenerMap = new Map<string, IDisposable>();
const languageDefaultsMap = new Map<string, LanguageServiceDefaults>();

function setupMode(defaults: LanguageServiceDefaults) {
	const languageId = defaults.languageId;

	import('./setupLanguageMode').then((mode) => {
		if (languageModesMap.has(languageId)) {
			languageModesMap.get(languageId)?.dispose();
		}
		languageModesMap.set(languageId, mode.setupLanguageMode(defaults));
	});
}

export function setupLanguageFeatures(
	languageId: LanguageIdEnum,
	configuration: FeatureConfiguration
) {
	if (typeof configuration !== 'object') {
		return;
	}

	const { preprocessCode, ...rest } = configuration;
	const modeConf = processConfiguration(languageId, rest);

	// Set up before language load
	const defaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
		languageId,
		modeConf,
		preprocessCode
	);

	languageDefaultsMap.set(languageId, defaults);

	if (featureLoadedMap.get(languageId)) {
		setupMode(defaults);
	} else {
		// Avoid calling setup multiple times when language loaded
		if (registerListenerMap.has(languageId)) {
			registerListenerMap.get(languageId)?.dispose();
		}
		registerListenerMap.set(
			languageId,
			languages.onLanguage(languageId, () => {
				setupMode(defaults);
				featureLoadedMap.set(languageId, true);
			})
		);
	}
}

function getDefaultSnippets(languageId: LanguageIdEnum) {
	switch (languageId) {
		case LanguageIdEnum.HIVE:
			return snippets.hiveSnippets;
		case LanguageIdEnum.FLINK:
			return snippets.flinkSnippets;
		case LanguageIdEnum.IMPALA:
			return snippets.impalaSnippets;
		case LanguageIdEnum.MYSQL:
			return snippets.mysqlSnippets;
		case LanguageIdEnum.PG:
			return snippets.pgsqlSnippets;
		case LanguageIdEnum.SPARK:
			return snippets.sparkSnippets;
		case LanguageIdEnum.TRINO:
			return snippets.trinoSnippets;
		default:
			return [];
	}
}

function processConfiguration(
	languageId: LanguageIdEnum,
	configuration: FeatureConfiguration
): ModeConfiguration {
	const defaults = languageDefaultsMap.get(languageId);

	const diagnostics =
		typeof configuration.diagnostics === 'boolean'
			? configuration.diagnostics
			: (defaults?.modeConfiguration.diagnostics ?? modeConfigurationDefault.diagnostics);

	const completionEnable =
		typeof configuration.completionItems === 'boolean'
			? configuration.completionItems
			: (defaults?.modeConfiguration.completionItems.enable ??
				modeConfigurationDefault.completionItems.enable);

	const completionService =
		typeof configuration.completionItems !== 'boolean' &&
		typeof configuration.completionItems?.completionService === 'function'
			? configuration.completionItems?.completionService
			: (defaults?.modeConfiguration.completionItems.completionService ??
				modeConfigurationDefault.completionItems.completionService);

	const triggerCharacters =
		typeof configuration.completionItems !== 'boolean' &&
		Array.isArray(configuration.completionItems?.triggerCharacters)
			? configuration.completionItems!.triggerCharacters
			: (defaults?.modeConfiguration.completionItems.triggerCharacters ??
				modeConfigurationDefault.completionItems.triggerCharacters);
	const references =
		typeof configuration.references === 'boolean'
			? configuration.references
			: (defaults?.modeConfiguration.references ?? modeConfigurationDefault.references);
	const definitions =
		typeof configuration.definitions === 'boolean'
			? configuration.definitions
			: (defaults?.modeConfiguration.definitions ?? modeConfigurationDefault.definitions);
	const hover =
		typeof configuration.hover === 'boolean'
			? configuration.hover
			: (defaults?.modeConfiguration.hover ?? modeConfigurationDefault.hover);

	const snippets =
		typeof configuration.completionItems !== 'boolean' &&
		Array.isArray(configuration.completionItems?.snippets)
			? configuration.completionItems!.snippets
			: (defaults?.modeConfiguration.completionItems.snippets ??
				getDefaultSnippets(languageId));

	return {
		diagnostics,
		completionItems: {
			enable: completionEnable,
			completionService,
			triggerCharacters,
			snippets
		},
		references,
		definitions,
		hover
	};
}
