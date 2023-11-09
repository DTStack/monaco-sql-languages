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

const languageId = 'flinksql';

export function registerFlinkSQLLanguage(
	completionService?: CompletionService,
	options?: SupportedModeConfiguration
) {
	registerLanguage({
		id: languageId,
		extensions: ['.flinksql'],
		aliases: ['FlinkSQL', 'flink', 'Flink'],
		loader: () => import('./flinksql')
	});

	loadLanguage(languageId);

	const modeConfiguration = typeof options === 'object' ? options : {};

	const flinkDefaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
		languageId,
		diagnosticDefault,
		{ ...modeConfigurationDefault, ...modeConfiguration },
		completionService
	);

	languages.onLanguage(languageId, () => {
		import('../setupLanguageMode').then((mode) => mode.setupLanguageMode(flinkDefaults));
	});
}
