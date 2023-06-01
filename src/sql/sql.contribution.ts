/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {
	diagnosticDefault,
	LanguageServiceDefaults,
	LanguageServiceDefaultsImpl,
	modeConfigurationDefault,
	registerLanguage
} from '../_.contribution';
import { languages } from '../fillers/monaco-editor-core';

const languageId = 'sql';

registerLanguage({
	id: languageId,
	extensions: ['.sql'],
	aliases: ['SQL'],
	loader: () => import('./sql')
});

const defaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	languageId,
	diagnosticDefault,
	modeConfigurationDefault
);

languages.onLanguage(languageId, () => {
	import('../setupLanguageMode').then((mode) => mode.setupLanguageMode(defaults));
});
