/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../../_.contribution';
import { LanguageIdEnum } from '../../common/constants';
import { setupLanguageFeatures } from '../../setupLanguageFeatures';

registerLanguage({
	id: LanguageIdEnum.PG,
	extensions: ['.pgsql'],
	aliases: ['PgSQL', 'postgresql', 'PostgreSQL'],
	loader: () => import('./pgsql')
});

setupLanguageFeatures(LanguageIdEnum.PG, {
	completionItems: true,
	diagnostics: true,
	references: true,
	definitions: true
});
