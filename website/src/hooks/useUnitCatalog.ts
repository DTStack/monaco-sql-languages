import { tree } from '@dtinsight/molecule';
import { useEffect, useState } from 'react';

export function useUnitCatalog({
	callback
}: {
	callback?: (data: tree.TreeNodeModel<void>) => void;
}) {
	const [data, setData] = useState<tree.TreeNodeModel<void> | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		mutate();
	}, []);

	const mutate = (): Promise<tree.TreeNodeModel<any>> => {
		setLoading(true);
		return fetch('/api/getUnitCatalog', { method: 'post' })
			.then((res) => res.json())
			.then(
				({
					data: { folders, files }
				}: {
					data: { folders: string[]; files: string[] };
				}) => {
					const data = new tree.TreeNodeModel<void>(
						'molecule',
						'molecule',
						'RootFolder',
						[
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
							...files.map(
								(file) => new tree.TreeNodeModel<void>(`/${file}`, file, 'File')
							)
						]
					);
					setData(data);
					callback?.(data);
					return data;
				}
			)
			.finally(() => {
				setLoading(false);
			});
	};

	return {
		data,
		loading,
		mutate
	};
}
