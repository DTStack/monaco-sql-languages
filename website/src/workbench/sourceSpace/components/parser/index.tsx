import { IEditorTab, IMenuItemProps, IMoleculeContext, slots, UniqueId } from '@dtinsight/molecule';

import { useState } from 'react';
import lips from '@jcubic/lips';
import { Tree } from '@dtinsight/molecule/esm/client/components';
import { randomId } from '@/utils/tool';
import * as monaco from 'monaco-editor';

import { FILE_PATH, PARSE_LANGUAGE } from '@/consts';
import { LanguageService, ParseError } from 'monaco-sql-languages/esm/languageService';

import './style.css';

interface IFile {
	name: string;
	icon: string;
}

const { Explorer } = slots;

const Parser = ({ molecule }: { molecule: IMoleculeContext }) => {
	const [fileData, setFileData] = useState<Record<string, IEditorTab<IFile>[]>>({});
	const languageService = new LanguageService();

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
		const model = monaco.editor.createModel(
			'', // 空内容
			file.language?.toLocaleLowerCase(), // 指定语言（比如空文件用 plaintext）
			monaco.Uri.parse(`${file.language}/${file.name}`)
		);
		monaco.editor.getModel(model.uri);
		molecule.editor.open({ ...file }, molecule.editor.getState().groups?.at(0)?.id);
	};

	// const analystProblems = () => {};

	// const setupOutputLanguage = async () => {
	// 	const model = await molecule.panel.outputEditorInstance?.getModel();
	// 	if (model) {
	// 		monaco.editor.setModelLanguage(model, 'clojure');
	// 	}
	// };

	const parseToAST = () => {
		// todo: 暂时注释掉，因为我不知道这段代码是做什么用的
		// this.setupOutputLanguage();
		const sql = molecule.editor.getCurrentGroup()?.editorInstance?.getValue();
		molecule.panel.reset();
		const curActiveTab = molecule.editor.getCurrentTab();
		const lang = curActiveTab?.language?.toLocaleLowerCase();
		if (lang && sql) {
			languageService.parserTreeToString(lang, sql).then((res) => {
				const pre = res?.replace(/(\(|\))/g, '$1\n');
				const format = new lips.Formatter(pre);
				const formatted = format.format({
					indent: 2,
					offset: 2
				});
				molecule.panel.update({
					id: molecule.builtin.getConstants().PANEL_ITEM_OUTPUT,
					data: formatted
				});
			});
		}
	};

	const handleOpenFile = (file: IEditorTab<IFile>) => {
		handleUpdateStatusBarPath(file);
		handleUpdateStatusBarLang(file);
		// analystProblems(nextTab);
		const groupId = molecule.editor.getState().groups?.at(0)?.id;
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
