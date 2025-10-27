import Tabs from '@/components/tabs';
import { SOURCE_FILE } from '@/consts';
import { useUnitCatalog } from '@/hooks/useUnitCatalog';
import { openFile } from '@/utils';
import { components, IMoleculeContext } from '@dtinsight/molecule';
import { Progress } from '@dtinsight/molecule/esm/client/components';
import { useConnector } from '@dtinsight/molecule/esm/client/hooks';
import { FolderTree } from '@dtinsight/molecule/esm/client/slots';
import { FolderTreeEvent } from '@dtinsight/molecule/esm/models/folderTree';
import { searchById } from '@dtinsight/molecule/esm/utils';
import { TreeNodeModel } from '@dtinsight/molecule/esm/utils/tree';
import { createElement, useEffect } from 'react';
// sql-parser 的 unit 文档
const UnitTest = ({ molecule }: { molecule: IMoleculeContext }) => {
	const sidebar = useConnector('sidebar');
	const pane = sidebar.data.find(searchById(sidebar.current));

	const { loading } = useUnitCatalog({
		callback: (tree) => {
			molecule.folderTree.add(tree, 'unitTest');
		}
	});

	useEffect(() => {
		molecule.explorer.update({
			id: 'unitTest',
			// todo 这里的 any 需要看下可以具体定义不
			render: (panel) => {
				return createElement(FolderTree as any, { panel });
			}
		});
	}, []);

	const handleSelect = (treeNode: TreeNodeModel<any>) => {
		const group = molecule.editor.getGroups().find((group) => {
			const tab = molecule.editor.getTab(treeNode.id, group.id);
			return !!tab;
		});
		if (group) {
			const tab = molecule.editor.getTab(treeNode.id, group.id)!;
			molecule.editor.setCurrent(tab.id, group.id);
		} else if (treeNode.fileType === 'File') {
			openFile(treeNode, molecule);
		} else {
			// 点击是文件夹
			molecule.folderTree.toggleExpanded(treeNode.id);

			if (!Array.isArray(treeNode.children)) {
				molecule.folderTree.emit(FolderTreeEvent.onLoad, treeNode.id);
			}
		}
	};

	const renderUnitContent = () => {
		return (
			<components.ScrollBar isShowShadow>
				<FolderTree
					panel={{ id: 'unitTest' }}
					{...(molecule.folderTree as any)}
					onSelect={handleSelect}
				/>
			</components.ScrollBar>
		);
	};

	const items = [
		{
			id: SOURCE_FILE,
			key: SOURCE_FILE,
			name: (pane?.name || '') as string,
			children: renderUnitContent()
		}
	];

	return (
		<div>
			<Progress active={loading} />
			<Tabs data={items}></Tabs>
		</div>
	);
};

export default UnitTest;
