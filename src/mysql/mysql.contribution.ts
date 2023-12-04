/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { loadLanguage, registerLanguage } from '../_.contribution';
import { setupLanguageFeatures } from '../setupLanguageFeatures';
import { LanguageIdEnum } from '../common/constants';

registerLanguage({
	id: LanguageIdEnum.MYSQL,
	extensions: ['mysql'],
	aliases: ['MySQL', 'mysql'],
	loader: () => import('./mysql')
});

loadLanguage(LanguageIdEnum.MYSQL);

setupLanguageFeatures({
	languageId: LanguageIdEnum.MYSQL,
	completionItems: true,
	diagnostics: true
});
