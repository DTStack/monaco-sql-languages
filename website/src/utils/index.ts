import { IMoleculeContext, tree } from '@dtinsight/molecule';

export function getWorkspace(): Promise<tree.TreeNodeModel<any>> {
	return fetch('/api/getWorkspace')
		.then((res) => res.json())
		.then(({ data: { folders, files } }: { data: { folders: string[]; files: string[] } }) => {
			return new tree.TreeNodeModel<void>('molecule', 'molecule', 'RootFolder', [
				...folders.map(
					(folder) =>
						new tree.TreeNodeModel<void>(
							`/${folder}`,
							folder,
							'Folder',
							undefined,
							'folder'
						)
				),
				...files.map((file) => new tree.TreeNodeModel<void>(`/${file}`, file, 'File'))
			]);
		});
}

export function getFileContent(path: string): Promise<string> {
	return fetch(`/api/getFileContent/${encodeURIComponent(path.replaceAll(/\//g, '!'))}`)
		.then((res) => res.json())
		.then(({ data }: { data: string }) => {
			return data;
		});
}

export function getFiles(path: string) {
	return fetch(`/api/getFiles/${encodeURIComponent(path.replaceAll(/\//g, '!'))}`)
		.then((res) => res.json())
		.then(({ data: { folders, files } }: { data: { folders: string[]; files: string[] } }) => {
			return [
				folders.map(
					(folder) =>
						new tree.TreeNodeModel<void>(
							`${path}/${folder}`,
							folder,
							'Folder',
							undefined,
							'folder'
						)
				),
				files.map((file) => new tree.TreeNodeModel<void>(`${path}/${file}`, file, 'File'))
			];
		});
}

export function searchFileContents(value: string) {
	return fetch(`/api/search`, { method: 'post', body: JSON.stringify({ value }) })
		.then((res) => res.json())
		.then(
			({
				data
			}: {
				data: { filename: string; path: string; startline: number; data: string }[];
			}) => data
		);
}

export function openFile(treeNode: any, molecule: IMoleculeContext) {
	molecule.editor.setLoading(true);
	getFileContent(treeNode.id as string)
		.then((data) => {
			const tabData = {
				id: treeNode.id,
				name: treeNode.name,
				icon: treeNode.icon || 'file',
				value: data,
				language: (() => {
					const name = treeNode.name;
					if (typeof name !== 'string') return 'plain';
					if (name.endsWith('.md')) return 'markdown';
					if (name.endsWith('.yml')) return 'yml';
					if (name.endsWith('.js')) return 'javascript';
					if (name.endsWith('.ts')) return 'typescript';
					if (name.endsWith('.tsx')) return 'typescriptreact';
					if (name.endsWith('.json')) return 'json';
					if (name.endsWith('.scss')) return 'css';
					if (name.endsWith('.html')) return 'html';
					return 'plain';
				})(),
				breadcrumb: (treeNode.id as string)
					.split('/')
					.filter(Boolean)
					.map((i) => ({ id: i, name: i }))
			};
			molecule.editor.open(tabData, molecule.editor.getState().groups?.at(0)?.id);
		})
		.catch((err) => {
			molecule.layout.setNotification(true);
			molecule.notification.add({
				id: `getFileContent_${treeNode.id}`,
				value: err.message
			});
		})
		.finally(() => {
			molecule.editor.setLoading(false);
		});
}
