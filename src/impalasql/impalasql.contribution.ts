/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';
import { setupLanguageFeatures } from '../setupLanguageFeatures';
import { LanguageIdEnum } from '../common/constants';

registerLanguage({
	id: LanguageIdEnum.IMPALA,
	extensions: ['.impalasql'],
	aliases: ['impalaSQL', 'impala', 'Impala'],
	loader: () => import('./impalasql')
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.IMPALA,
	completionItems: true,
	diagnostics: true
});
