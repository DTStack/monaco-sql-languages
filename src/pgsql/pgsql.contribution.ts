/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { loadLanguage, registerLanguage } from '../_.contribution';
import { setupLanguageFeatures } from '../setupLanguageFeatures';
import { LanguageIdEnum } from '../common/constants';

registerLanguage({
	id: LanguageIdEnum.PG,
	extensions: ['.pgsql'],
	aliases: ['PgSQL', 'postgresql', 'PostgreSQL'],
	loader: () => import('./pgsql')
});

loadLanguage(LanguageIdEnum.PG);

setupLanguageFeatures({
	languageId: LanguageIdEnum.PG,
	completionItems: true,
	diagnostics: true
});
