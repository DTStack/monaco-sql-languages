import { produce } from 'immer';
import { useSyncExternalStore } from 'react';
import * as monaco from 'monaco-editor';
import type { IMoleculeContext, IEditorTab, IMenuItemProps } from '@dtinsight/molecule';
import type { IFile } from '@/workbench/sourceSpace/components/parser';
import { randomId } from '@/utils/tool';
import { FILE_PATH, PARSE_LANGUAGE } from '@/consts';

/** ---------- store ---------- **/
interface FileState {
	fileData: Record<string, IEditorTab<IFile>[]>;
	explorerData: Record<string, IEditorTab<IFile>[]>;
}
let state: FileState = { fileData: {}, explorerData: {} };
const listeners = new Set<() => void>();
let moleculeInstance: IMoleculeContext | null = null; // 单例存储 molecule

export const getState = () => state;
export const setState = (recipe: (draft: FileState) => void) => {
	state = produce(state, recipe);
	listeners.forEach((l) => l());
};
export const subscribe = (listener: () => void) => {
	listeners.add(listener);
	return () => listeners.delete(listener);
};

// 初始化 molecule,避免不同的组件中都需要通过参数 将 molecule 实例转入；
export const initMolecule = (molecule: IMoleculeContext) => {
	moleculeInstance = molecule;
};

/** ---------- React Hook ---------- **/
export const useFileStore = () => useSyncExternalStore(subscribe, getState);

/** ---------- tools ---------- **/
export const updateStatusBarPath = (file: IEditorTab<IFile>) => {
	if (!moleculeInstance) return;
	const filePath = `${file.language}/${file.name}`;
	moleculeInstance.statusBar.update({ id: FILE_PATH, name: filePath });
};

export const updateStatusBarLang = (file: IEditorTab<IFile>) => {
	if (!moleculeInstance) return;
	const language = file.language?.toLowerCase();
	moleculeInstance.statusBar.update({ id: PARSE_LANGUAGE, name: language });
};

export const updateEditor = (file: IEditorTab<IFile>) => {
	if (!moleculeInstance) return;
	const uri = monaco.Uri.parse(`${file.language}/${file.name}`);
	let model = monaco.editor.getModel(uri);
	if (!model) {
		model = monaco.editor.createModel('', file.language?.toLowerCase(), uri);
	}
	const defaultGroupId = moleculeInstance.editor.getState().groups?.[0]?.id || -1;
	moleculeInstance.editor.open({ ...file }, defaultGroupId);
	if (model && file.language) {
		monaco.editor.setModelLanguage(model, file.language.toLowerCase());
	}
};

export const openFile = (file: IEditorTab<IFile>) => {
	if (!moleculeInstance) return;
	updateStatusBarPath(file);
	updateStatusBarLang(file);

	const groupId = moleculeInstance.editor.getState().groups?.[0]?.id || -1;
	const groups = moleculeInstance.editor.getGroups();
	if (groups.some((group) => group.activeTab === file.id)) return;

	const allTabs = groups.flatMap((group) => group.data);
	const hasOpened = allTabs.find((tab) => tab.id === file.id);
	if (hasOpened && groupId) {
		moleculeInstance.editor.setCurrent(file.id, groupId);
		return;
	}
	updateEditor(file);
};

export const updateExplorer = (file: IEditorTab<IFile>) => {
	const curSQL = file.language;
	if (!curSQL) return;
	setState((draft) => {
		if (!draft.explorerData[curSQL]) draft.explorerData[curSQL] = [];
		draft.explorerData[curSQL].push(file);
	});
	return getState();
};

export const addFile = (item: IMenuItemProps) => {
	const { id } = item;
	const curSQL = (id as string).split('_')?.[1];
	const fileName = `${curSQL.toLowerCase()}_file_${randomId()}.sql`;
	const newFile = { name: fileName, icon: 'file', id: fileName, language: curSQL };

	setState((draft) => {
		if (!draft.fileData[curSQL]) draft.fileData[curSQL] = [];
		draft.fileData[curSQL].push(newFile as any);
	});
	return getState();
};
