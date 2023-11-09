/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

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

const languageId = 'flinksql';
let disposables: IDisposable = {
	dispose() {}
};

registerLanguage({
	id: languageId,
	extensions: ['.flinksql'],
	aliases: ['FlinkSQL', 'flink', 'Flink'],
	loader: () => import('./flinksql')
});

loadLanguage(languageId);

export function registerFlinkSQLLanguage(
	completionService?: CompletionService,
	options?: SupportedModeConfiguration
) {
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
