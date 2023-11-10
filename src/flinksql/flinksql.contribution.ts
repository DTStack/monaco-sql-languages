/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { loadLanguage, registerLanguage } from '../_.contribution';
import { setupLanguageFeatures } from '../setupLanguageFeatures';
import { LanguageIdEnum } from '../common/constants';

registerLanguage({
	id: LanguageIdEnum.FLINK,
	extensions: ['.flinksql'],
	aliases: ['FlinkSQL', 'flink', 'Flink'],
	loader: () => import('./flinksql')
});

loadLanguage(LanguageIdEnum.FLINK);

setupLanguageFeatures({
	languageId: LanguageIdEnum.FLINK,
	completionItems: true,
	diagnostics: true
});
