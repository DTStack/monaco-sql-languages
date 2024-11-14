/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../../_.contribution';
import { LanguageIdEnum } from '../../common/constants';
import { setupLanguageFeatures } from '../../setupLanguageFeatures';

registerLanguage({
	id: LanguageIdEnum.SPARK,
	extensions: ['.sparksql'],
	aliases: ['SparkSQL', 'spark', 'Spark'],
	loader: () => import('./spark')
});

setupLanguageFeatures(LanguageIdEnum.SPARK, {
	completionItems: true,
	diagnostics: true,
	references: true,
	definitions: true
});
