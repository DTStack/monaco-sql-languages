import { IContributeType, IExtension, UniqueId, utils, components } from '@dtinsight/molecule';
import {
	CREATE_TASK_ID,
	DELETE_TASK_ID,
	EVENTS,
	POWERED_BY,
	RUN_SQL_ID,
	SUPPORT_LANGUAGES,
	TASK_PATH,
	TASK_TYPE
} from '../../const';
import type { IExplorerPanelItem } from '@dtinsight/molecule/esm/models/explorer';
import Tree from '../../workbench/tree';
import * as content from '../../storage/content';
import * as task from '../../storage/task';
import { TreeNodeModel } from '@dtinsight/molecule/esm/utils/tree';
import Language from '../../workbench/language';
import Path from '../../workbench/path';
import { LanguageIdEnum } from 'monaco-sql-languages/out/esm/main.js';
import PoweredBy from '../../workbench/powerBy';
import QuickExecuteAction from '../actions/quickExecuteAction';
import Space from '../../components/space';

export const defaultExt: IExtension = {
	id: 'defaultExt',
	name: 'defaultExt',
	contributes: {
		[IContributeType.Modules]: {
			menuBar: null,
			activityBar: null,
			sidebar: import('../../workbench/sidebar'),
			editor: import('../../workbench/editor')
		}
	},
	activate(molecule) {
		molecule.editor.setOptions({
			fontFamily: 'Maple Mono'
		});
		// 默认不展示 Panel
		molecule.layout.setPanel(false);
		// 重置 toolbar
		molecule.editor.dispatch((draft) => {
			draft.toolbar = [
				{
					id: RUN_SQL_ID,
					group: 'inline',
					icon: 'run'
				}
			];
		});
		molecule.statusBar.add({
			id: TASK_TYPE,
			name: '编辑器语言',
			alignment: 'right',
			sortIndex: 12,
			render: () => <Language />
		});
		// FIXME: 空状态不应该有宽度
		molecule.statusBar.add({
			id: TASK_PATH,
			name: '路径',
			alignment: 'left',
			sortIndex: 2,
			render: () => <Path />
		});
		molecule.statusBar.add({
			id: POWERED_BY,
			name: '关于',
			alignment: 'left',
			sortIndex: 1,
			render: () => <PoweredBy />
		});

		const items = SUPPORT_LANGUAGES.map(
			(key) =>
				({
					id: key,
					// FIXME: Should Support ReactNode
					name: (
						<Space>
							<components.Icon type="repo" />
							{key}
						</Space>
					) as any,
					toolbar: [
						{
							id: CREATE_TASK_ID,
							name: '新建任务',
							group: 'inline',
							icon: 'new-file'
						}
					],
					render: () => (
						<Tree
							id={key}
							molecule={molecule}
							onSelect={(treeNode) => {
								if (treeNode.id !== molecule.editor.getCurrentTab()?.id) {
									closeCurrentTab();
									openTab(treeNode);
								}
							}}
							onCreate={async () => {
								const item = await create(key);
								closeCurrentTab();
								await openTab(item);
							}}
							onContextMenu={(pos, treeNode) => {
								molecule.contextMenu.open(
									[
										{
											id: DELETE_TASK_ID,
											name: '删除任务'
										}
									],
									pos,
									{ id: treeNode.data?.language, treeId: treeNode.id }
								);
							}}
						/>
					)
				} as IExplorerPanelItem)
		);
		molecule.explorer.reset();
		molecule.explorer.add(items);
		molecule.explorer.setActive(items.map((item) => item.id));

		molecule.explorer.onPanelToolbarClick(async (toolbar, panel) => {
			if (toolbar.id === CREATE_TASK_ID) {
				const item = await create(panel as LanguageIdEnum);
				closeCurrentTab();
				await openTab(item);
			}
		});

		molecule.editor.onToolbarClick((item) => {
			if (item.id === RUN_SQL_ID) {
				molecule.action.execute(QuickExecuteAction.ID);
			}
		});

		molecule.editor.onClose((tabs) => {
			tabs.forEach((tab) => {
				content.set(tab.id as string, tab.value || '');
			});
		});

		molecule.contextMenu.onClick((item) => {
			const scope = molecule.contextMenu.getScope<{ id: LanguageIdEnum; treeId: UniqueId }>();
			switch (item.id) {
				case DELETE_TASK_ID: {
					const tab = molecule.editor.getCurrentTab();
					if (tab?.id === scope.treeId) {
						closeCurrentTab();
					}
					content.remove(scope.treeId as string);
					task.update(scope.id, (prev) => {
						const next = prev?.concat() || [];
						const idx = next.findIndex(utils.searchById(scope.treeId));
						if (idx === -1) return next;
						next.splice(idx, 1);
						return next;
					});
					break;
				}

				default:
					break;
			}
		});

		molecule.contextMenu.onClick((menu) => {
			if (SUPPORT_LANGUAGES.includes(menu.id as LanguageIdEnum)) {
				molecule.explorer.togglePanel(menu.id);
			}
		});

		molecule.editor.subscribe(EVENTS.EDITOR_UPDATE_NAME, (value: string) => {
			const tab = molecule.editor.getCurrentTab();
			const groupId = molecule.editor.getCurrent();
			if (tab && groupId) {
				molecule.editor.updateTab({ id: tab.id, name: value }, groupId);
				task.update(tab.language as string, (prev) => {
					const next = prev?.concat() || [];
					const idx = next.findIndex(utils.searchById(tab.id));
					if (idx === -1) return next;
					next[idx].name = value;
					return next;
				});
			}
		});

		async function create(key: LanguageIdEnum) {
			const id = new Date().valueOf().toString();
			const name = `默认_${key}_任务`;
			const item = new TreeNodeModel<{ language: LanguageIdEnum }>(
				id,
				name,
				'File',
				undefined,
				undefined,
				false,
				{
					language: key
				}
			);
			await task.update(key, (prev) => {
				if (Array.isArray(prev)) {
					return [...prev, item];
				}

				return [item];
			});

			return item;
		}

		async function openTab(tree: TreeNodeModel<{ language: string }>) {
			const value = await content.get(tree.id as string);
			molecule.editor.open({
				id: tree.id,
				name: tree.name,
				value,
				language: tree.data?.language
			});
		}

		function closeCurrentTab() {
			const tab = molecule.editor.getCurrentTab();
			if (tab) {
				molecule.editor.closeTab(tab.id, molecule.editor.getCurrentGroup()!.id);
			}
		}
	}
};
