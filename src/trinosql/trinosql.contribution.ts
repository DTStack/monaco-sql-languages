import { registerLanguage } from '../_.contribution';
import { setupLanguageFeatures } from '../setupLanguageFeatures';
import { LanguageIdEnum } from '../common/constants';

registerLanguage({
	id: LanguageIdEnum.TRINO,
	extensions: ['.trinosql'],
	aliases: ['TrinoSQL', 'trino', 'Trino', 'prestosql', 'PrestoSQL', 'presto', 'Presto'],
	loader: () => import('./trinosql')
});

setupLanguageFeatures({
	languageId: LanguageIdEnum.TRINO,
	completionItems: true,
	diagnostics: true
});
