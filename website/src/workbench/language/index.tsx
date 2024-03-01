import { hooks, utils } from '@dtinsight/molecule';

export default function Language() {
	const editor = hooks.useConnector('editor');
	const group = editor.groups.find(utils.searchById(editor.current));
	const tab = group?.data.find(utils.searchById(group.activeTab));
	if (!tab) return null;

	return <>{tab.language}</>;
}
