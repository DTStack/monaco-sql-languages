import { hooks, components, utils } from '@dtinsight/molecule';
import { Container } from './styled';
import Tab from '../tab';
import { useMemo } from 'react';
import { IEditorController } from '@dtinsight/molecule/esm/controllers/editor';

export default function Editor({ onMount, onModelMount, onToolbarClick }: IEditorController) {
	const editor = hooks.useConnector('editor');
	const settings = hooks.useSettings();
	const options = useMemo(
		() => ({
			...settings.editor,
			...editor.options
		}),
		[editor.options, settings.editor]
	);

	const group = editor.groups.find(utils.searchById(editor.current));
	const tab = group?.data.find(utils.searchById(group.activeTab));
	return (
		<Container>
			<components.Progress active={editor.loading} />
			{tab ? (
				<Tab
					data={tab}
					groupId={group!.id}
					instance={group?.editorInstance}
					toolbar={editor.toolbar}
					options={options}
					onMount={onMount}
					onModelMount={onModelMount}
					onToolbarClick={onToolbarClick}
				/>
			) : (
				editor.entry || <components.Welcome />
			)}
		</Container>
	);
}
