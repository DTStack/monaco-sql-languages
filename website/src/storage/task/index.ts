import * as idb from 'idb-keyval';
import { useEffect, useState } from 'react';
import { TreeNode } from '../../types';

type Updater = (oldValue?: TreeNode[]) => TreeNode[];

const trigger: (() => void)[] = [];

export async function set(id: string, value: TreeNode[]) {
	await idb.set(`dtinsight/${id}`, value);
	trigger.forEach((fn) => fn());
}

export function get(id: string) {
	return idb.get<TreeNode[]>(`dtinsight/${id}`);
}

export async function update(id: string, updater: Updater) {
	await idb.update(`dtinsight/${id}`, updater);
	trigger.forEach((fn) => fn());
}

export function useTask(id: string) {
	const [data, setData] = useState<TreeNode[]>([]);

	function update() {
		get(id)
			.then((values) => {
				setData(values || []);
			})
			.catch((error) => {
				console.error(error);
				setData([]);
			});
	}

	useEffect(() => {
		update();
		trigger.push(update);
	}, []);

	return data;
}
