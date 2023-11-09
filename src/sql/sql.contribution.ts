/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { loadLanguage, registerLanguage } from '../_.contribution';
import { setupLanguageFeatures } from '../setupLanguageFeatures';
import { LanguageIdEnum } from '../common/constants';

registerLanguage({
	id: LanguageIdEnum.SQL,
	extensions: ['.sql'],
	aliases: ['SQL'],
	loader: () => import('./sql')
});

loadLanguage(LanguageIdEnum.SQL);

setupLanguageFeatures({
	languageId: LanguageIdEnum.SQL,
	completionItems: false,
	diagnostics: true
});
