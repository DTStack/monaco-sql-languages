import { IMoleculeContext, hooks, components, utils, IPosition } from '@dtinsight/molecule';
import { useTask } from '../../storage/task';
import { Empty, TreeContainer } from './styled';
import { createElement, useMemo } from 'react';
import { helper } from '../../components/icon/helper';
import { TreeNode } from '../../types';

interface ITreeProps {
	id: string;
	molecule: IMoleculeContext;
	onSelect: components.ITreeProps['onSelect'];
	onCreate: () => void;
	onContextMenu: (pos: IPosition, treeNode: TreeNode) => void;
}

export default function Tree({ id, onSelect, onCreate, onContextMenu }: ITreeProps) {
	const editor = hooks.useConnector('editor');
	const rawData = useTask(id);

	const activeKey = editor.groups.find(utils.searchById(editor.current))?.activeTab;

	const data = useMemo(
		() =>
			rawData.map((item) => ({ ...item, icon: createElement(helper(item.data?.language)) })),
		[rawData]
	);

	return (
		<components.ScrollBar
			scrollIntoViewDeps={{
				dep: activeKey,
				activeClassName: 'mo-tree__treenode--active'
			}}
		>
			<components.Prevent>
				{data.length ? (
					<TreeContainer>
						<components.Tree
							draggable={false}
							activeKey={activeKey}
							data={data}
							onSelect={onSelect}
							onContextMenu={(pos, treeNode) => onContextMenu(pos, treeNode)}
						/>
					</TreeContainer>
				) : (
					<Empty>
						暂无数据
						<components.Button block onClick={onCreate}>
							点击新建 SQL 文件
						</components.Button>
					</Empty>
				)}
			</components.Prevent>
		</components.ScrollBar>
	);
}
