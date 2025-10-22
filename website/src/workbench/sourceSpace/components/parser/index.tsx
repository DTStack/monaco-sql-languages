import { IMenuItemProps, IMoleculeContext, slots, UniqueId } from '@dtinsight/molecule';

import { Tree } from '@dtinsight/molecule/esm/client/components';
import { randomId } from '@/utils/tool';

import './style.css';
import { useFileManager } from '@/hooks/useFileManage';

export interface IFile {
	name: string;
	icon: string;
}

const { Explorer } = slots;

const Parser = ({ molecule }: { molecule: IMoleculeContext }) => {
	const {
		updateExplorer,
		openFile: handleEditorOpen,
		addFile
	} = useFileManager({
		molecule
	});

	const handleAddFile = (item: IMenuItemProps) => {
		const { id } = item;
		const curSQL = (id as string).split('_')?.[1];
		const fileName = `${curSQL.toLocaleLowerCase()}_file_${randomId()}.sql`;
		addFile(item);

		const curFileArray = updateExplorer({
			name: fileName,
			icon: 'file',
			id: fileName,
			language: curSQL
		});

		molecule.explorer.update({
			id: curSQL,
			render: () => {
				return <Tree data={curFileArray as any} onSelect={handleEditorOpen}></Tree>;
			}
		});
	};

	const handleClick = (activeKeys: UniqueId[]) => {
		molecule.explorer.setActive(activeKeys);
	};

	return (
		<div className="folder-tree">
			<Explorer
				{...(molecule.explorer as any)}
				onToolbarClick={handleAddFile}
				onCollapseChange={handleClick}
			></Explorer>
		</div>
	);
};

export default Parser;
