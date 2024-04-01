import {
	PreprocessCode,
	LanguageServiceDefaults,
	LanguageServiceDefaultsImpl,
	modeConfigurationDefault,
	ModeConfiguration,
	CompletionOptions
} from './monaco.contribution';
import { languages, IDisposable } from './fillers/monaco-editor-core';
import { LanguageIdEnum } from './common/constants';

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

function processConfiguration(
	languageId: LanguageIdEnum,
	configuration: FeatureConfiguration
): ModeConfiguration {
	const defaults = languageDefaultsMap.get(languageId);

	const diagnostics =
		typeof configuration.diagnostics === 'boolean'
			? configuration.diagnostics
			: defaults?.modeConfiguration.diagnostics ?? modeConfigurationDefault.diagnostics;

	const completionEnable =
		typeof configuration.completionItems === 'boolean'
			? configuration.completionItems
			: defaults?.modeConfiguration.completionItems.enable ??
			  modeConfigurationDefault.completionItems.enable;

	const completionService =
		typeof configuration.completionItems !== 'boolean' &&
		typeof configuration.completionItems?.completionService === 'function'
			? configuration.completionItems?.completionService
			: defaults?.modeConfiguration.completionItems.completionService ??
			  modeConfigurationDefault.completionItems.completionService;

	const triggerCharacters =
		typeof configuration.completionItems !== 'boolean' &&
		Array.isArray(configuration.completionItems?.triggerCharacters)
			? configuration.completionItems!.triggerCharacters
			: defaults?.modeConfiguration.completionItems.triggerCharacters ??
			  modeConfigurationDefault.completionItems.triggerCharacters;

	return {
		diagnostics,
		completionItems: {
			enable: completionEnable,
			completionService,
			triggerCharacters
		}
	};
}
