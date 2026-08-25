import { LanguageIdEnum } from './common/constants';
import { IDisposable, languages } from './fillers/monaco-editor-core';
import {
	assertFormatEntryImported,
	getFormatActionRegistrar,
	setFormatActionRegistrarReadyHandler
} from './formatBridge';
import {
	CompletionOptions,
	FormatOptions,
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
	 * Defines whether the built-in Format action is enabled.
	 * Defaults to false.
	 * When enabled, a single "Format" item is added to the editor context menu:
	 * formats the selection when present, otherwise formats the whole document.
	 * Import `monaco-sql-languages/format` once (requires optional peer `sql-formatter`)
	 * before enabling format; otherwise `setupLanguageFeatures` throws.
	 * If the format entry is imported later, languages that already loaded are re-registered.
	 */
	format?: boolean | Partial<FormatOptions>;
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
/** Monotonic token so overlapping async `setupMode` calls discard stale results. */
const setupModeSeqMap = new Map<string, number>();

function setupMode(defaults: LanguageServiceDefaults) {
	const languageId = defaults.languageId;
	const seq = (setupModeSeqMap.get(languageId) ?? 0) + 1;
	setupModeSeqMap.set(languageId, seq);

	import('./setupLanguageMode').then((mode) => {
		if (setupModeSeqMap.get(languageId) !== seq) {
			return;
		}
		if (languageModesMap.has(languageId)) {
			languageModesMap.get(languageId)?.dispose();
		}
		languageModesMap.set(languageId, mode.setupLanguageMode(defaults));
	});
}

/** Re-run mode setup for languages that need Format after the format entry loads late. */
function compensateFormatRegistration(): void {
	languageDefaultsMap.forEach((defaults, languageId) => {
		if (!defaults.modeConfiguration.format.enable) {
			return;
		}
		if (featureLoadedMap.get(languageId) || languageModesMap.has(languageId)) {
			setupMode(defaults);
		}
	});
}

setFormatActionRegistrarReadyHandler(compensateFormatRegistration);

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

	const formatEnabled = modeConf.format.enable;
	const hasFormatRegistrar = !!getFormatActionRegistrar();

	if (featureLoadedMap.get(languageId)) {
		// Skip mode setup when format is enabled but the format entry is not loaded yet;
		// `compensateFormatRegistration` will run after `import 'monaco-sql-languages/format'`.
		if (!formatEnabled || hasFormatRegistrar) {
			setupMode(defaults);
		}
	} else {
		// Avoid calling setup multiple times when language loaded
		if (registerListenerMap.has(languageId)) {
			registerListenerMap.get(languageId)?.dispose();
		}
		registerListenerMap.set(
			languageId,
			languages.onLanguage(languageId, () => {
				const latest = languageDefaultsMap.get(languageId) ?? defaults;
				setupMode(latest);
				featureLoadedMap.set(languageId, true);
			})
		);
	}

	if (formatEnabled) {
		assertFormatEntryImported(languageId);
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
		case LanguageIdEnum.GENERIC:
			return snippets.genericSnippets;
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

	const formatPartial =
		configuration.format != null && typeof configuration.format !== 'boolean'
			? configuration.format
			: undefined;

	const formatEnable =
		typeof configuration.format === 'boolean'
			? configuration.format
			: (formatPartial?.enable ??
				defaults?.modeConfiguration.format.enable ??
				modeConfigurationDefault.format.enable);

	const formatFallback =
		typeof formatPartial?.fallback === 'function'
			? formatPartial.fallback
			: defaults?.modeConfiguration.format.fallback;

	const formatTabWidth =
		typeof formatPartial?.tabWidth === 'number'
			? formatPartial.tabWidth
			: defaults?.modeConfiguration.format.tabWidth;

	const formatKeybindings =
		formatPartial != null && Array.isArray(formatPartial.keybindings)
			? formatPartial.keybindings
			: defaults?.modeConfiguration.format.keybindings;

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
		hover,
		format: {
			enable: formatEnable,
			fallback: formatFallback,
			tabWidth: formatTabWidth,
			keybindings: formatKeybindings
		}
	};
}
