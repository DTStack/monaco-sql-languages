/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	DiagnosticsOptions,
	LanguageServiceDefaults,
	LanguageServiceDefaultsImpl,
	ModeConfiguration,
	registerLanguage
} from '../_.contribution';
import { languages } from '../fillers/monaco-editor-core';

const languageId = 'sparksql';

registerLanguage({
	id: languageId,
	extensions: ['.sparksql'],
	aliases: ['SparkSQL'],
	loader: () => import('./sparksql')
});

const diagnosticDefault: Required<DiagnosticsOptions> = {
	validate: true
};

const modeConfigurationDefault: Required<ModeConfiguration> = {
	completionItems: true,
	hovers: true,
	documentSymbols: true,
	definitions: true,
	references: true,
	documentHighlights: true,
	rename: true,
	colors: true,
	foldingRanges: true,
	diagnostics: true,
	selectionRanges: true
};

const defaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	languageId,
	diagnosticDefault,
	modeConfigurationDefault
);

languages.onLanguage(languageId, () => {
	import('../setupLanguageMode').then((mode) => mode.setupLanguageMode(defaults));
});
