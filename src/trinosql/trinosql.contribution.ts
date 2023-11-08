import {
	CompletionService,
	diagnosticDefault,
	LanguageServiceDefaults,
	LanguageServiceDefaultsImpl,
	loadLanguage,
	modeConfigurationDefault,
	registerLanguage,
	SupportedModeConfiguration
} from '../_.contribution';
import { languages } from '../fillers/monaco-editor-core';

const languageId = 'trinosql';

export function registerTrinoSQLLanguage(
	completionService?: CompletionService,
	options?: SupportedModeConfiguration
) {
	registerLanguage({
		id: languageId,
		extensions: [],
		aliases: ['TrinoSQL', 'trino', 'Trino', 'prestosql', 'PrestoSQL', 'presto', 'Presto'],
		loader: () => import('./trinosql')
	});

	loadLanguage(languageId);

	const modeConfiguration = typeof options === 'object' ? options : {};

	const defaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
		languageId,
		diagnosticDefault,
		{ ...modeConfigurationDefault, ...modeConfiguration },
		completionService
	);

	languages.onLanguage(languageId, () => {
		import('../setupLanguageMode').then((mode) => mode.setupLanguageMode(defaults));
	});
}
