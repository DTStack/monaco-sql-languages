/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../../_.contribution';
import { LanguageIdEnum } from '../../common/constants';
import { setupLanguageFeatures } from '../../setupLanguageFeatures';

registerLanguage({
	id: LanguageIdEnum.MYSQL,
	extensions: ['.mysql'],
	aliases: ['MySQL', 'mysql'],
	loader: () => import('./mysql')
});

setupLanguageFeatures(LanguageIdEnum.MYSQL, {
	completionItems: true,
	diagnostics: true,
	references: false,
	definitions: false,
	hover: false
});
