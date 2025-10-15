import { IEditorTab, IMenuItemProps, IMoleculeContext, slots, UniqueId } from '@dtinsight/molecule';

import { useState } from 'react';
import { Tree } from '@dtinsight/molecule/esm/client/components';
import { randomId } from '@/utils/tool';
import * as monaco from 'monaco-editor';

import { FILE_PATH, PARSE_LANGUAGE } from '@/consts';

import './style.css';

interface IFile {
	name: string;
	icon: string;
}

const { Explorer } = slots;

const Parser = ({ molecule }: { molecule: IMoleculeContext }) => {
	const [fileData, setFileData] = useState<Record<string, IEditorTab<IFile>[]>>({});

	const addFile = (item: IMenuItemProps) => {
		const { id } = item;
		const curSQL = (id as string).split('_')?.[1];
		const fileName = `${curSQL.toLocaleLowerCase()}_file_${randomId()}.sql`;
		let curFileArray = fileData[curSQL];
		if (!fileData[curSQL]?.length) {
			curFileArray = [];
		}
		curFileArray.push({ name: fileName, icon: 'file', id: fileName, language: curSQL });
		setFileData({
			...fileData,
			[curSQL]: curFileArray
		});

		molecule.explorer.update({
			id: curSQL,
			render: () => {
				return <Tree data={curFileArray as any} onSelect={handleOpenFile}></Tree>;
			}
		});
	};

	const handleUpdateStatusBarPath = (file: IEditorTab<IFile>) => {
		const filePath = `${file.language}/${file.name}`;
		molecule.statusBar.update({
			id: FILE_PATH,
			name: filePath
		});
	};

	const handleUpdateStatusBarLang = (file: IEditorTab<IFile>) => {
		const language = file.language?.toLocaleLowerCase();
		molecule.statusBar.update({
			id: PARSE_LANGUAGE,
			name: language
		});
	};

	const handleUpdateEditor = (file: IEditorTab<IFile>) => {
		// 打开文件，需要确定不同的 sql 类型， 使用不同的 sql 解析器
		let model = monaco.editor.getModel(monaco.Uri.parse(`${file.language}/${file.name}`));
		if (!model) {
			model = monaco.editor.createModel(
				'', // 空内容
				file.language?.toLocaleLowerCase(), // 指定语言（比如空文件用 plaintext）
				monaco.Uri.parse(`${file.language}/${file.name}`)
			);
		}

		monaco.editor.getModel(model.uri);
		const defaultGroupId = molecule.editor.getState().groups?.at(0)?.id || -1;
		// todo: 已经保存的再次打开，需要把文件的 value 保存下来
		molecule.editor.open({ ...file }, defaultGroupId);
		if (model && file.language) {
			monaco.editor.setModelLanguage(model, file.language.toLocaleLowerCase());
		}
	};

	const handleOpenFile = (file: IEditorTab<IFile>) => {
		handleUpdateStatusBarPath(file);
		handleUpdateStatusBarLang(file);

		// analystProblems(nextTab);

		const groupId = molecule.editor.getState().groups?.at(0)?.id || -1;
		// 如果已经 active, 则不走逻辑
		const curActiveTab = molecule.editor.getCurrentTab();
		const isAgainOpenTab = curActiveTab?.id === file.id;
		if (isAgainOpenTab) {
			return;
		}
		// 如果已经打开不是 active ，则 active
		const currentTabs = molecule.editor.getCurrentTabs();
		const hasOpened = currentTabs?.find((item) => item.id === file.id);
		if (hasOpened && groupId) {
			molecule.editor.setCurrent(file.id, groupId);
			return;
		}
		// 如果新打开的文件， 则走下面的逻辑
		handleUpdateEditor(file);
	};

	const handleClick = (activeKeys: UniqueId[]) => {
		molecule.explorer.setActive(activeKeys);
	};

	return (
		<div className="folder-tree">
			<Explorer
				{...(molecule.explorer as any)}
				onToolbarClick={addFile}
				onCollapseChange={handleClick}
			></Explorer>
		</div>
	);
};

export default Parser;
