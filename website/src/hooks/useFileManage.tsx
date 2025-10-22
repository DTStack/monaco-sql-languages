import { useCallback, useState } from 'react';
import { IEditorTab, IMenuItemProps, IMoleculeContext } from '@dtinsight/molecule';
import * as monaco from 'monaco-editor';
import { randomId } from '@/utils/tool';
import { FILE_PATH, PARSE_LANGUAGE } from '@/consts';
import { IFile } from '@/workbench/sourceSpace/components/parser';

export const useFileManager = ({ molecule }: { molecule: IMoleculeContext }) => {
	const [fileData, setFileData] = useState<Record<string, any> | null>(null);
	const [explorerData, setExplorerData] = useState<Record<string, any>>({});

	// 更新状态栏路径
	const updateStatusBarPath = useCallback((file: IEditorTab<IFile>) => {
		const filePath = `${file.language}/${file.name}`;
		molecule.statusBar.update({
			id: FILE_PATH,
			name: filePath
		});
	}, []);

	// 更新状态栏语言
	const updateStatusBarLang = useCallback((file: IEditorTab<IFile>) => {
		const language = file.language?.toLowerCase();
		molecule.statusBar.update({
			id: PARSE_LANGUAGE,
			name: language
		});
	}, []);

	// 打开文件到编辑器
	const updateEditor = useCallback((file: IEditorTab<IFile>) => {
		const uri = monaco.Uri.parse(`${file.language}/${file.name}`);
		let model = monaco.editor.getModel(uri);
		if (!model) {
			model = monaco.editor.createModel('', file.language?.toLowerCase(), uri);
		}

		const defaultGroupId = molecule.editor.getState().groups?.[0]?.id || -1;
		// todo: 已经保存的再次打开，需要把文件的 value 保存下来
		molecule.editor.open({ ...file }, defaultGroupId);

		if (model && file.language) {
			monaco.editor.setModelLanguage(model, file.language.toLowerCase());
		}
	}, []);

	// 打开文件逻辑
	const openFile = useCallback(
		(file: IEditorTab<IFile>) => {
			updateStatusBarPath(file);
			updateStatusBarLang(file);

			const groupId = molecule.editor.getState().groups?.[0]?.id || -1;
			const groups = molecule.editor.getGroups();

			// 已激活则返回
			if (groups.some((group) => group.activeTab === file.id)) return;

			// 已打开则激活
			const allTabs = groups.flatMap((group) => group.data);
			const hasOpened = allTabs.find((tab) => tab.id === file.id);
			if (hasOpened && groupId) {
				molecule.editor.setCurrent(file.id, groupId);
				return;
			}
			// 否则新打开
			updateEditor(file);
		},
		[updateEditor, updateStatusBarLang, updateStatusBarPath]
	);

	// FIXME：快速创建 & 点击 explore 创建的时候，数据没有共用
	const updateExplorer = useCallback(
		(file: IEditorTab<IFile>) => {
			const curSQL = file.language;
			if (!curSQL) return;
			const next = { ...explorerData };
			if (!next[curSQL]) next[curSQL] = [];
			next[curSQL].push(file);
			setExplorerData(next);
			return next[curSQL];
		},
		[explorerData]
	);

	// 新建文件
	const addFile = useCallback(
		(item: IMenuItemProps) => {
			const { id } = item;
			const curSQL = (id as string).split('_')?.[1];
			const fileName = `${curSQL.toLowerCase()}_file_${randomId()}.sql`;

			const newFile = { name: fileName, icon: 'file', id: fileName, language: curSQL };

			const next = { ...fileData };
			if (!next[curSQL]) next[curSQL] = [];
			next[curSQL].push(newFile);
			setFileData(next);
		},
		[fileData, setFileData, openFile]
	);

	return { fileData, explorerData, addFile, openFile, updateExplorer };
};
