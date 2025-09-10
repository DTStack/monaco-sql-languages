import Tabs from '@/components/tabs';
import { SOURCE_FILE } from '@/consts';
import { useUnitCatalog } from '@/hooks/useUnitCatalog';
import { components, IMoleculeContext } from '@dtinsight/molecule';
import { Progress } from '@dtinsight/molecule/esm/client/components';
import { useConnector } from '@dtinsight/molecule/esm/client/hooks';
import { FolderTree } from '@dtinsight/molecule/esm/client/slots';
import { searchById } from '@dtinsight/molecule/esm/utils';
import { createElement, useEffect } from 'react';
// sql-parser 的 unit 文档
const UnitTest = ({ molecule }: { molecule: IMoleculeContext }) => {
	const sidebar = useConnector('sidebar');
	const pane = sidebar.data.find(searchById(sidebar.current));

	const { data, loading } = useUnitCatalog({
		callback: (tree) => {
			molecule.panel.update({
				id: 1
			});
			molecule.folderTree.add(tree, 'unitTest');
		}
	});

	console.log('loading', loading);

	useEffect(() => {
		molecule.explorer.update({
			id: 'unitTest',
			// todo 这里的 any 需要看下可以具体定义不
			render: (panel) => {
				return createElement(FolderTree as any, { panel });
			}
		});
	}, []);

	const renderUnitContent = () => {
		return (
			<components.ScrollBar isShowShadow>
				<FolderTree panel={{ id: 'unitTest' }} />
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
