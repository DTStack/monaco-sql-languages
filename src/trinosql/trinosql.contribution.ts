import {
	CompletionService,
	diagnosticDefault,
	LanguageServiceDefaults,
	LanguageServiceDefaultsImpl,
	loadLanguage,
	modeConfigurationDefault,
	registerLanguage
} from '../_.contribution';
import { languages } from '../fillers/monaco-editor-core';

const languageId = 'trinosql';

export function registerTrinoSQLLanguage(completionService?: CompletionService) {
	registerLanguage({
		id: languageId,
		extensions: [],
		aliases: ['TrinoSQL', 'trinosql', 'trino', 'prestosql'],
		loader: () => import('./trinosql')
	});

	loadLanguage(languageId);

	const defaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
		languageId,
		diagnosticDefault,
		modeConfigurationDefault,
		completionService
	);

	languages.onLanguage(languageId, () => {
		import('../setupLanguageMode').then((mode) => mode.setupLanguageMode(defaults));
	});
}
