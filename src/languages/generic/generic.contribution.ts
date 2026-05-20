import { registerLanguage } from '../../_.contribution';
import { LanguageIdEnum } from '../../common/constants';
import { setupLanguageFeatures } from '../../setupLanguageFeatures';

registerLanguage({
	id: LanguageIdEnum.GENERIC,
	extensions: ['.genericsql'],
	aliases: ['GenericSQL', 'generic', 'Generic'],
	loader: () => import('./generic')
});

setupLanguageFeatures(LanguageIdEnum.GENERIC, {
	completionItems: true,
	diagnostics: false,
	references: false,
	definitions: false,
	hover: false
});
