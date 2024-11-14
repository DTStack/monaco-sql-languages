import type { CompletionSnippetOption } from 'src/monaco.contribution';

export const sparkSnippets: CompletionSnippetOption[] = [
	{
		prefix: 'INSERT',
		label: 'INSERT代码片段',
		body: ['insert', 'into', '\t`${1:table1}`', 'values', '\t(`$2`);', '${3}']
	},
	{
		prefix: 'SELECT',
		label: 'SELECT 通用模板',
		body: ['select', '\t${1:id}', 'from', '\t${2:table1};', '${3}']
	}
];
