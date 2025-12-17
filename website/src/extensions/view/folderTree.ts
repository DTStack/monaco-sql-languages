import { getFiles } from '@/utils';
import { IExtension } from '@dtinsight/molecule';

export const ExtendsFolderTree: IExtension = {
	id: 'ExtendsFolderTree',
	name: 'Extend The Default Folder Tree',
	contributes: {},
	activate: function (molecule): void {
		molecule.folderTree.onLoad((id) => {
			molecule.folderTree.addLoading(id);
			getFiles(id as string)
				.then(([folder, files]) => {
					molecule.folderTree.update({
						id,
						children: [...folder, ...files]
					});
				})
				.catch((err) => {
					molecule.layout.setNotification(true);
					molecule.notification.add({
						id: `getFiles${id}`,
						value: err.message
					});
				})
				.finally(() => {
					molecule.folderTree.removeLoading(id);
				});
		});
	}
};
