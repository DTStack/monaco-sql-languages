import { loadLanguage, registerLanguage } from '../_.contribution';
import { setupLanguageFeatures } from '../setupLanguageFeatures';
import { LanguageIdEnum } from '../common/constants';

registerLanguage({
	id: LanguageIdEnum.TRINO,
	extensions: [],
	aliases: ['TrinoSQL', 'trino', 'Trino', 'prestosql', 'PrestoSQL', 'presto', 'Presto'],
	loader: () => import('./trinosql')
});

loadLanguage(LanguageIdEnum.TRINO);

setupLanguageFeatures({
	languageId: LanguageIdEnum.TRINO,
	completionItems: true,
	diagnostics: true
});
