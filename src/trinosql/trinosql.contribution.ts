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
import { languages, IDisposable } from '../fillers/monaco-editor-core';

const languageId = 'trinosql';
let disposables: IDisposable = {
	dispose() {}
};

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
		import('../setupLanguageMode').then((mode) => {
			disposables.dispose();
			disposables = mode.setupLanguageMode(defaults);
			return disposables;
		});
	});
}
