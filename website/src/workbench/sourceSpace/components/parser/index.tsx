import { IMenuItemProps, IMoleculeContext, slots, UniqueId } from '@dtinsight/molecule';

import { Tree } from '@dtinsight/molecule/esm/client/components';
import { randomId } from '@/utils/tool';

import './style.css';
import { addFile, initMolecule, openFile, updateExplorer } from '@/services/fileManagerService';

export interface IFile {
	name: string;
	icon: string;
}

const { Explorer } = slots;

const Parser = ({ molecule }: { molecule: IMoleculeContext }) => {
	initMolecule(molecule);
	const handleAddFile = (item: IMenuItemProps) => {
		const { id } = item;
		const curSQL = (id as string).split('_')?.[1];
		const fileName = `${curSQL.toLocaleLowerCase()}_file_${randomId()}.sql`;
		addFile(item);
		const { explorerData } =
			updateExplorer({
				name: fileName,
				icon: 'file',
				id: fileName,
				language: curSQL
			}) || {};

		molecule.explorer.update({
			id: curSQL,
			render: () => {
				return (
					explorerData && (
						<Tree data={explorerData?.[curSQL] as any} onSelect={openFile}></Tree>
					)
				);
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
