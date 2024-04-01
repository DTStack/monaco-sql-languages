import {
	CompletionService,
	PreprocessCode,
	LanguageServiceDefaults,
	LanguageServiceDefaultsImpl,
	modeConfigurationDefault
} from './monaco.contribution';
import { languages, IDisposable } from './fillers/monaco-editor-core';
import { LanguageIdEnum } from './common/constants';

type LanguageId = `${LanguageIdEnum}`;

export interface FeatureConfiguration {
	/**
	 * Defines whether the built-in completionItemProvider is enabled.
	 * Defaults to true.
	 */
	completionItems?: boolean;
	/**
	 * Defines whether the built-in diagnostic provider is enabled.
	 * Defaults to true.
	 */
	diagnostics?: boolean;
	/**
	 * Define a service to customize  completionItems.
	 * By default, only keyword autocomplete items are included.
	 */
	completionService?: CompletionService;
	/**
	 * Define a function to preprocess code.
	 * By default, do not something.
	 */
	preprocessCode?: PreprocessCode;
}

const disposableMap = new Map<LanguageId, IDisposable>();
const featureLoadedMap = new Map<LanguageId, boolean>();
const configurationMap = new Map<LanguageId, FeatureConfiguration>();

export function setupLanguageFeatures(
	languageId: LanguageIdEnum,
	configuration: FeatureConfiguration
) {
	if (typeof configuration !== 'object') {
		return;
	}

	const { completionService, preprocessCode, ...rest } = processConfiguration(
		languageId,
		configuration
	);

	const defaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
		languageId,
		Object.assign({}, modeConfigurationDefault, rest),
		completionService,
		preprocessCode
	);

	function setup() {
		import('./setupLanguageMode').then((mode) => {
			if (disposableMap.has(languageId)) {
				disposableMap.get(languageId)?.dispose();
			}
			const disposable = mode.setupLanguageMode(defaults);
			disposableMap.set(languageId, disposable);
			return disposable;
		});
	}

	if (featureLoadedMap.get(languageId)) {
		setup();
	} else {
		languages.onLanguage(languageId, () => {
			setup();
			featureLoadedMap.set(languageId, true);
		});
	}
}

function processConfiguration(languageId: LanguageIdEnum, configuration: FeatureConfiguration) {
	let finalConfiguration = Object.assign({}, configuration);

	const currentConfiguration = configurationMap.get(languageId);

	if (currentConfiguration) {
		finalConfiguration = Object.assign({}, currentConfiguration, finalConfiguration);
	}

	if (
		// The following languages are not support codeCompletion now.
		[LanguageIdEnum.PL].includes(languageId as LanguageIdEnum)
	) {
		finalConfiguration.completionItems = false;
	}

	if (
		// The following languages are not support diagnostics now.
		[LanguageIdEnum.SQL].includes(languageId as LanguageIdEnum)
	) {
		finalConfiguration.diagnostics = false;
	}

	// save current configurationMap
	configurationMap.set(languageId, finalConfiguration);

	return finalConfiguration;
}
