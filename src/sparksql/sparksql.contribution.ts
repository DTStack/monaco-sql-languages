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
import { languages } from '../fillers/monaco-editor-core';

const languageId = 'sparksql';

export function registerSparkSQLLanguage(
	completionService?: CompletionService,
	options?: SupportedModeConfiguration
) {
	registerLanguage({
		id: languageId,
		extensions: ['.sparksql'],
		aliases: ['SparkSQL', 'spark', 'Spark'],
		loader: () => import('./sparksql')
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
