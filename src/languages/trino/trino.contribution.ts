import { registerLanguage } from '../../_.contribution';
import { setupLanguageFeatures } from '../../setupLanguageFeatures';
import { LanguageIdEnum } from '../../common/constants';

registerLanguage({
	id: LanguageIdEnum.TRINO,
	extensions: ['.trinosql'],
	aliases: ['TrinoSQL', 'trino', 'Trino', 'prestosql', 'PrestoSQL', 'presto', 'Presto'],
	loader: () => import('./trino')
});

setupLanguageFeatures(LanguageIdEnum.TRINO, {
	completionItems: true,
	diagnostics: true
});
