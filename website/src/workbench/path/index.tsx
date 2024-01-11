import { hooks, utils } from '@dtinsight/molecule';
import { Text } from './styled';

export default function Path() {
	const editor = hooks.useConnector('editor');
	const group = editor.groups.find(utils.searchById(editor.current));
	const tab = group?.data.find(utils.searchById(group.activeTab));
	if (!tab) return null;

	return (
		<Text title={`~/${tab.language}/${tab.name}`}>
			~/{tab.language}/{tab.name}
		</Text>
	);
}
