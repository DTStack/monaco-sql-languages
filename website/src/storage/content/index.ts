import * as idb from 'idb-keyval';

const tableName = `dtinsight/content`;

export function set(id: string, content: string) {
	return idb.update<Map<string, string>>(tableName, (prev) => {
		const next = prev || new Map<string, string>();
		next.set(id, content);
		return next;
	});
}

export async function get(id: string) {
	const value = await idb.get<Map<string, string>>(tableName);
	return value?.get(id);
}

export async function remove(id: string) {
	return idb.update<Map<string, string>>(tableName, (prev) => {
		const next = prev || new Map<string, string>();
		next.delete(id);
		return next;
	});
}
