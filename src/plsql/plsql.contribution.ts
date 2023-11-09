/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { loadLanguage, registerLanguage } from '../_.contribution';
import { setupLanguageFeatures } from '../setupLanguageFeatures';
import { LanguageIdEnum } from '../common/constants';

registerLanguage({
	id: LanguageIdEnum.PL,
	extensions: [],
	aliases: ['PLSQL'],
	loader: () => import('./plsql')
});

loadLanguage(LanguageIdEnum.PL);

setupLanguageFeatures({
	languageId: LanguageIdEnum.PL,
	completionItems: false,
	diagnostics: true
});
