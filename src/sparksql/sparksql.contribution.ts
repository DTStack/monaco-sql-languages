/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { loadLanguage, registerLanguage } from '../_.contribution';
import { setupLanguageFeatures } from '../setupLanguageFeatures';
import { LanguageIdEnum } from '../common/constants';

registerLanguage({
	id: LanguageIdEnum.SPARK,
	extensions: ['.sparksql'],
	aliases: ['SparkSQL', 'spark', 'Spark'],
	loader: () => import('./sparksql')
});

loadLanguage(LanguageIdEnum.SPARK);

setupLanguageFeatures({
	languageId: LanguageIdEnum.SPARK,
	completionItems: true,
	diagnostics: true
});
