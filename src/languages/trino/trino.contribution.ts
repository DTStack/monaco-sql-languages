import { registerLanguage } from '../../_.contribution';
import { LanguageIdEnum } from '../../common/constants';
import { setupLanguageFeatures } from '../../setupLanguageFeatures';

registerLanguage({
	id: LanguageIdEnum.TRINO,
	extensions: ['.trinosql'],
	aliases: ['TrinoSQL', 'trino', 'Trino', 'prestosql', 'PrestoSQL', 'presto', 'Presto'],
	loader: () => import('./trino')
});

setupLanguageFeatures(LanguageIdEnum.TRINO, {
	completionItems: true,
	diagnostics: true,
	references: true,
	definitions: true
});
