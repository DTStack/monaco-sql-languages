import {
	IContributeType,
	IEditorTab,
	IExtension,
	IMoleculeContext,
	TabGroup,
	UniqueId
} from '@dtinsight/molecule';
import lips from '@jcubic/lips';

import * as monaco from 'monaco-editor';
import { vsPlusTheme } from 'monaco-sql-languages/esm/main';

import Welcome from '@/workbench/welcome';
import {
	FILE_PATH,
	QUICK_GITHUB,
	PARSE_LANGUAGE,
	ACTIVITY_FOLDER,
	ACTIVITY_SQL,
	ACTIVITY_API,
	SQL_LANGUAGES,
	PARSE_TREE
} from '@/consts';
import QuickGithub from '@/workbench/quickGithub';
import SourceSpace from '@/workbench/sourceSpace';
import UnitTest from '@/workbench/unitTest';
import ApiDocPage from '@/workbench/apiDocPage';
import { debounce } from '@/utils/tool';
import { LanguageService } from '../../../../esm/languageService';
import { ParseError } from 'dt-sql-parser';
import { ProblemsPaneView } from '@/workbench/problems';
import ProblemStore from '@/workbench/problems/clients/problemStore';
import { ProblemsService } from '@/workbench/problems/services';
import { ProblemsController } from '@/workbench/problems/controllers';
import TreeVisualizerPanel from '@/components/treeVisualizerPanel';

const problemsService = new ProblemsService();

export const mainExt: IExtension = {
	id: 'mainExt',
	name: 'mainExt',
	contributes: {
		[IContributeType.Modules]: {
			menuBar: null
		}
		// [IContributeType.Grammar]: grammars
	},
	activate(molecule) {
		const languageService = new LanguageService();
		problemsService.onSelect((item) => {
			// 写入展开的数组内； 当展开的时候 root 的icon 进行变换
			problemsService.toggleRoot(item);
		});

		// 注册 Molecule 的 textMate sql-dark 主题（与 Monaco 使用同名 sql-dark, 其中 colors 是copy molecule vs-dark 的 colors ）
		molecule.colorTheme.add([
			{
				id: 'sql-dark',
				label: 'SQL Dark',
				name: 'sql-dark',
				uiTheme: 'vs-dark',
				colors: {
					'checkbox.border': '#6B6B6B',
					'editor.background': '#1E1E1E',
					'editor.foreground': '#D4D4D4',
					'editor.inactiveSelectionBackground': '#3A3D41',
					'editorIndentGuide.background': '#404040',
					'editorIndentGuide.activeBackground': '#707070',
					'editor.selectionHighlightBackground': '#ADD6FF26',
					'list.dropBackground': '#383B3D',
					'activityBarBadge.background': '#007ACC',
					'sideBarTitle.foreground': '#BBBBBB',
					'input.placeholderForeground': '#A6A6A6',
					'menu.background': '#252526',
					'menu.foreground': '#CCCCCC',
					'menu.separatorBackground': '#454545',
					'menu.border': '#454545',
					'statusBarItem.remoteForeground': '#FFF',
					'statusBarItem.remoteBackground': '#16825D',
					'ports.iconRunningProcessForeground': '#369432',
					'sideBarSectionHeader.background': '#0000',
					'sideBarSectionHeader.border': '#ccc3',
					'tab.lastPinnedBorder': '#ccc3',
					'list.activeSelectionIconForeground': '#FFF',
					'terminal.inactiveSelectionBackground': '#3A3D41',
					'widget.border': '#303031',
					'actionBar.toggledBackground': '#383a49',
					'statusBar.background': '#252526',
					'statusBar.border': '#333'
				},
				semanticHighlighting: true
			}
		]);

		molecule.colorTheme.update('Default Dark+', (data) => ({
			colors: {
				...data.colors,
				'statusBar.background': '#252526',
				'statusBar.border': '#333',
				'panel.background': '#202020',
				'sideBar.background': '#252526',
				'editor.background': '#161616'
			}
		}));

		molecule.colorTheme.setCurrent('sql-dark');

		// 拦截 Molecule 切换主题，避免其覆盖 Monaco 的 sql-dark
		const originalSetCurrent = molecule.colorTheme.setCurrent.bind(molecule.colorTheme);
		molecule.colorTheme.setCurrent = (id: string) => {
			originalSetCurrent(id);
			// Molecule 主题变化后，重新应用 Monaco 主题
			if (id === 'sql-dark') {
				monaco.editor.defineTheme('sql-dark', vsPlusTheme.darkThemeData);
				monaco.editor.setTheme('sql-dark');
			} else {
				monaco.editor.setTheme('vs-dark');
			}
			monaco.editor.getModels().forEach((model) => {
				const lang = model.getLanguageId();
				monaco.editor.setModelLanguage(model, lang);
			});
		};
		// 预定义 Monaco 主题，但推迟到编辑器创建后再应用，避免初始化阶段未就绪导致的高亮异常
		monaco.editor.defineTheme('sql-dark', vsPlusTheme.darkThemeData);
		let themeAppliedOnce = false;
		monaco.editor.onDidCreateEditor(() => {
			if (themeAppliedOnce) return;
			themeAppliedOnce = true;
			monaco.editor.setTheme('sql-dark');
			// 强制刷新所有模型的语法高亮
			monaco.editor.getModels().forEach((model) => {
				const lang = model.getLanguageId();
				monaco.editor.setModelLanguage(model, lang);
			});
		});

		molecule.editor.setEntry(<Welcome context={molecule} />);

		// ------- 初始化开始-----
		molecule.activityBar.reset();

		const { EXPLORER_ITEM_OPEN_EDITOR, EXPLORER_ITEM_WORKSPACE } =
			molecule.builtin.getConstants();

		molecule.explorer.update({
			id: EXPLORER_ITEM_OPEN_EDITOR,
			hidden: !molecule.explorer.get(EXPLORER_ITEM_OPEN_EDITOR)?.hidden
		});

		molecule.explorer.update({
			id: EXPLORER_ITEM_WORKSPACE,
			hidden: !molecule.explorer.get(EXPLORER_ITEM_WORKSPACE)?.hidden
		});
		// ------- 初始化完成-----

		molecule.sidebar.add({
			id: ACTIVITY_FOLDER,
			name: '',
			sortIndex: 1,
			render: () => <SourceSpace molecule={molecule} />
		});

		molecule.explorer.add(
			SQL_LANGUAGES?.map((item) => {
				return {
					id: item,
					name: item,
					toolbar: [
						{
							group: 'inline',
							icon: 'new-file',
							id: `explorer.contextMenu.createFile_${item}`,
							name: '新建文件'
						}
					]
				};
			})
		);

		molecule.sidebar.add({
			id: ACTIVITY_SQL,
			name: '单测 SQL',
			sortIndex: 1,
			render: () => <UnitTest molecule={molecule} />
		});
		molecule.sidebar.add({
			id: ACTIVITY_API,
			name: '接口文档',
			sortIndex: 1,
			render: () => <ApiDocPage molecule={molecule} />
		});

		molecule.activityBar.add([
			{
				id: ACTIVITY_FOLDER,
				name: '文件夹',
				sortIndex: 1,
				alignment: 'top',
				render: () => (
					<div className="activityBar-imgIcon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M9.19341 2.99998H3.31003C2.31041 3.00113 1.50137 3.81101 1.50024 4.81001V19.5641C1.50137 20.564 2.31043 21.3739 3.30918 21.375H20.6905C21.6901 21.3739 22.4991 20.564 22.5002 19.565V7.3569L22.4984 7.27626C22.4552 6.31387 21.6631 5.54714 20.6913 5.54605L12.4866 5.54585L10.4734 3.53063C10.1352 3.1903 9.67309 2.99869 9.19341 2.99998ZM9.19541 4.49997C9.27618 4.49976 9.35372 4.53191 9.41077 4.58933L11.5832 6.76392C11.7621 6.94445 12.0088 7.04687 12.266 7.04604L20.6904 7.04605C20.8609 7.04624 21 7.18551 21.0002 7.35774V9.65625H3.00023L3.00023 4.81085C3.00042 4.63945 3.13956 4.50017 3.31088 4.49997L9.19541 4.49997ZM3.00023 11.1562L3.00023 19.5633C3.00042 19.7355 3.13955 19.8748 3.31001 19.875H20.6896C20.8609 19.8748 21 19.7355 21.0002 19.5641L21.0002 11.1562H3.00023Z"
								fill="currentColor"
							/>
						</svg>
					</div>
				)
			},
			{
				id: ACTIVITY_SQL,
				name: '单测 SQL',
				sortIndex: 2,
				alignment: 'top',
				render: () => (
					<div className="activityBar-imgIcon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
						>
							<rect opacity="0.01" width="24" height="24" fill="currentColor" />
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M17.2757 6.37641C16.8633 3.8348 14.6584 1.89438 12.0003 1.89438C9.3359 1.89438 7.12687 3.84395 6.72189 6.39438C6.72209 6.39317 6.76999 6.39204 6.85918 6.39099L17.2757 6.37641ZM9.01804 4.81131C9.7269 3.94284 10.8059 3.39439 12.0002 3.39439L12.105 3.3958C13.2545 3.42676 14.2891 3.96555 14.9773 4.80505L15.0345 4.87676L14.4286 4.87713L8.96097 4.88239L9.01804 4.81131ZM18.707 9.5003C18.3619 8.76073 17.9206 8.08549 17.4015 7.49503C16.6615 7.51336 14.7786 7.52354 12.7631 7.52918L6.56248 7.53623C6.04838 8.12908 5.61208 8.8058 5.27184 9.54609L3.85048 8.72547C3.49176 8.51836 3.03307 8.64127 2.82596 8.99999C2.61885 9.35871 2.74176 9.8174 3.10048 10.0245L4.72427 10.962C4.73515 10.9683 4.74612 10.9743 4.75717 10.9799C4.60665 11.5473 4.50865 12.1396 4.46942 12.75H2.625C2.21079 12.75 1.875 13.0858 1.875 13.5C1.875 13.9142 2.21079 14.25 2.625 14.25H4.49237C4.55598 14.9174 4.69002 15.5614 4.88608 16.1727C4.84812 16.187 4.81082 16.2045 4.77454 16.2255L3.15074 17.163C2.79202 17.3701 2.66911 17.8288 2.87622 18.1875C3.08333 18.5462 3.54202 18.6691 3.90074 18.462L5.46453 17.5592C6.77106 20.0619 9.20862 21.745 12 21.745C14.7914 21.745 17.2289 20.0619 18.5355 17.5592L20.0993 18.462C20.458 18.6691 20.9167 18.5462 21.1238 18.1875C21.3309 17.8288 21.208 17.3701 20.8493 17.163L19.2255 16.2255C19.1892 16.2045 19.1519 16.187 19.1139 16.1727C19.31 15.5614 19.444 14.9174 19.5076 14.25H21.375C21.7892 14.25 22.125 13.9142 22.125 13.5C22.125 13.0858 21.7892 12.75 21.375 12.75H19.5306C19.4902 12.1219 19.3876 11.5129 19.2296 10.9306L20.799 10.0245C21.1577 9.8174 21.2806 9.35871 21.0735 8.99999C20.8664 8.64127 20.4077 8.51836 20.049 8.72547L18.707 9.5003ZM16.6889 9.00704L16.7676 9.11804C17.5887 10.3116 18.0501 11.7891 18.0501 13.3562C18.0501 16.8994 15.7094 19.772 12.75 20.1921V16.5C12.75 16.0858 12.4142 15.75 12 15.75C11.5858 15.75 11.25 16.0858 11.25 16.5V20.1921C8.29063 19.772 5.95007 16.8993 5.95007 13.3562L5.95193 13.184C5.98412 11.695 6.43305 10.2939 7.21106 9.1495L7.28957 9.03591L8.80434 9.03557C10.7409 9.03424 12.4519 9.03116 13.8482 9.02586L16.6889 9.00704Z"
								fill="currentColor"
							/>
						</svg>
					</div>
				)
			},
			{
				id: ACTIVITY_API,
				name: '接口文档',
				sortIndex: 3,
				alignment: 'top',
				render: () => (
					<div className="activityBar-imgIcon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M16.16 0C18.2823 0 20 1.71388 20 3.83002V16.17C20 18.2911 18.2873 20 16.17 20H3.84C1.71886 20 0.0100096 18.2873 0.0100096 16.17L0.00965667 7.03064C0.00330251 6.99136 0 6.95105 0 6.90997V3.83002C0 1.70888 1.71269 0 3.82999 0H16.16ZM18.4998 7.66998H1.51001V16.17C1.51001 17.431 2.50243 18.4536 3.75425 18.4985L3.84 18.5H16.17C17.4596 18.5 18.5 17.4619 18.5 16.17L18.4998 7.66998ZM10.8414 9.01758C11.2459 9.10674 11.5016 9.50693 11.4124 9.91144L10.0524 16.0814C9.96327 16.4859 9.56307 16.7416 9.15857 16.6524C8.75406 16.5632 8.49843 16.163 8.58759 15.7585L9.94757 9.58856C10.0367 9.18406 10.4369 8.92842 10.8414 9.01758ZM7.47033 10.3097C7.76323 10.6026 7.76323 11.0775 7.47033 11.3704L5.94937 12.891L7.47162 14.421C7.7638 14.7146 7.76264 15.1895 7.46904 15.4816C7.17543 15.7738 6.70056 15.7727 6.40838 15.479L4.35839 13.4191L4.347 13.4066L4.31587 13.3726C4.2607 13.3072 4.21851 13.2345 4.1893 13.1579L4.16983 13.0999C4.11304 12.9043 4.13738 12.6902 4.24285 12.5106C4.26006 12.4815 4.27826 12.4547 4.29837 12.429C4.31717 12.4049 4.3376 12.3818 4.35968 12.3597L6.40967 10.3097C6.70256 10.0168 7.17744 10.0168 7.47033 10.3097ZM13.6503 10.3097L15.6951 12.3545C15.6964 12.3558 15.6977 12.3571 15.6991 12.3584L15.743 12.406L15.7003 12.3597C15.7717 12.431 15.8257 12.5132 15.8623 12.6009C15.9361 12.7777 15.9392 12.9773 15.8714 13.1562C15.8391 13.2408 15.7923 13.3191 15.7302 13.3887C15.721 13.3991 15.7115 13.4092 15.7016 13.4191L13.6516 15.4791C13.3594 15.7727 12.8846 15.7738 12.591 15.4816C12.2973 15.1894 12.2962 14.7146 12.5884 14.421L14.1105 12.891L12.5897 11.3704C12.2968 11.0775 12.2968 10.6026 12.5897 10.3097C12.8826 10.0168 13.3574 10.0168 13.6503 10.3097ZM16.16 1.5H3.82999C2.54037 1.5 1.5 2.53805 1.5 3.83002V6.15975H18.5V3.83002C18.5 2.57166 17.5006 1.54648 16.2459 1.50154L16.16 1.5ZM3.82999 2.79999C4.39884 2.79999 4.85998 3.26116 4.85998 3.83002C4.85998 4.39887 4.39884 4.85998 3.82999 4.85998C3.26113 4.85998 2.79999 4.39887 2.79999 3.83002C2.79999 3.26116 3.26113 2.79999 3.82999 2.79999Z"
								fill="currentColor"
							/>
						</svg>
					</div>
				)
			}
		]);

		molecule.panel.add({
			id: 'problem',
			name: '问题',
			sortIndex: 2,
			render: () => {
				return (
					<ProblemStore
						value={{
							onselect: new ProblemsController().onSelect
						}}
					>
						<ProblemsPaneView problemsService={problemsService} />
					</ProblemStore>
				);
			}
		});

		molecule.statusBar.add({
			id: QUICK_GITHUB,
			name: 'Github',
			alignment: 'left',
			sortIndex: 1,
			render: () => <QuickGithub />
		});
		molecule.statusBar.add({
			id: FILE_PATH,
			name: 'path',
			alignment: 'left',
			sortIndex: 2
		});
		molecule.statusBar.add({
			id: PARSE_LANGUAGE,
			name: 'language',
			alignment: 'right',
			sortIndex: 2
		});

		// 主题切换按钮：在 Default Dark+ 与 sql-dark 之间切换
		molecule.statusBar.add({
			id: 'toggle-theme',
			alignment: 'right',
			sortIndex: 3,
			render: () => {
				const current = molecule.colorTheme.getCurrentTheme()?.id;
				const label = current === 'sql-dark' ? 'sql-dark' : 'Default Dark+';
				return (
					<span
						style={{ cursor: 'pointer' }}
						onClick={() => {
							const cur = molecule.colorTheme.getCurrentTheme()?.id;
							const next = cur === 'sql-dark' ? 'Default Dark+' : 'sql-dark';
							molecule.colorTheme.setCurrent(next);
							// 强制刷新所有模型的语法高亮
							monaco.editor.getModels().forEach((model) => {
								const lang = model.getLanguageId();
								monaco.editor.setModelLanguage(model, lang);
							});
							molecule.statusBar.update({ id: 'toggle-theme' });
						}}
					>
						{label}
					</span>
				);
			}
		});

		// 添加解析树可视化
		molecule.panel.add({
			id: PARSE_TREE,
			name: '语法解析树',
			sortIndex: 3,
			data: null,
			render: (panelItem) => {
				return <TreeVisualizerPanel parseTree={panelItem.data} />;
			}
		});

		molecule.activityBar.setCurrent(ACTIVITY_FOLDER);
		molecule.sidebar.setCurrent(ACTIVITY_FOLDER);

		molecule.editor.onCurrentChange((tab) => {
			const language = (tab.tabId as string)?.split('_')?.[0];
			const groups = molecule.editor.getGroups();
			const fileData = groups[0]?.data?.find((item) => item.id === tab.tabId);
			molecule.output.setState({ value: '' });

			if (fileData?.model) {
				monaco.editor.setModelLanguage(fileData.model, language);
				analyzeProblems({ fileData, molecule, tab, languageService });
				updateParseTree(molecule, languageService);
			}
			activeExplore(tab, molecule);
		});

		molecule.editor.onContextMenu((pos, tabId, groupId) => {
			molecule.editor.setCurrent(tabId, groupId);
			molecule.contextMenu.open(
				[
					{
						id: 'parse',
						name: 'parse'
					}
				],
				pos,
				{
					name: molecule.builtin.getConstants().CONTEXTMENU_ITEM_EDITOR,
					item: { tabId, groupId }
				}
			);
		});

		molecule.editor.onContextMenuClick((item, tabId, groupId) => {
			switch (item.id) {
				case 'parse': {
					updateParseTree(molecule, languageService);
					molecule.panel.setCurrent(PARSE_TREE);
					break;
				}
				default:
					break;
			}
		});

		molecule.editor.onFocus((item) => {
			const groupId = (molecule.editor.getCurrentGroup() || -1) as UniqueId;
			const tab = molecule.editor.getCurrentTab();
			if (tab?.id && tab.language) {
				molecule.editor.setCurrent(tab?.id, groupId);
			}
		});

		molecule.editor.onUpdateState((item) => {
			const tab = molecule.editor.getCurrentTab();
			const groups = molecule.editor.getGroups();
			const fileData = groups[0]?.data?.find((item) => item.id === tab?.id);
			analyzeProblems({ fileData, molecule, tab, languageService });
			debounceUpdateParseTree(molecule, languageService);
		});
	}
};

const analyzeProblems = debounce((info: any) => {
	const { fileData, molecule, tab, languageService } = info || {};
	const { value: sql, language } = fileData || {};

	// todo： 一定要 active Tab 才能获取到 language
	if (!language) return;

	languageService.valid(language.toLocaleLowerCase(), sql).then((res: ParseError[]) => {
		const problems = convertMsgToProblemItem(tab, sql, res);

		molecule.panel.update({
			id: 'problem',
			data: problems.value
		});
		problems.icon = 'chevron-right';
		problemsService.update(problems);
	});
}, 200);

const convertMsgToProblemItem = (tab: IEditorTab<any>, code: string, msgs: ParseError[] = []) => {
	const rootId = tab?.id;
	const rootName = `${tab.name || ''}`;
	const languageProblems = {
		id: rootId,
		name: rootName,
		isLeaf: false,
		value: {
			code: rootName,
			message: '',
			startLineNumber: 0,
			startColumn: 1,
			endLineNumber: 0,
			endColumn: 1,
			status: monaco.MarkerSeverity.Hint
		},
		children: []
	} as any;

	languageProblems.children = msgs.map((msg: any, index: number) => {
		return {
			id: `${rootId}-${index}`,
			name: msg.code || '',
			isLeaf: true,
			value: {
				code: msg.code,
				message: msg.message,
				startLineNumber: Number(msg.startLine),
				startColumn: Number(msg.startCol),
				endLineNumber: Number(msg.endLine),
				endColumn: Number(msg.endCol),
				status: monaco.MarkerSeverity.Error
			},
			children: []
		};
	});

	return languageProblems;
};

const activeExplore = (tab: Partial<TabGroup>, molecule: IMoleculeContext) => {
	const language = (tab.tabId as string)?.split('_')?.[0];
	const curActiveExplore = molecule.explorer.getActive() || [];
	const isExist = curActiveExplore
		.map((item) => (item as string).toLocaleLowerCase())
		.includes(language?.toLocaleLowerCase());
	if (!isExist && language) {
		const activeExploreId = SQL_LANGUAGES.find(
			(item) => item.toLocaleLowerCase() === language.toLocaleLowerCase()
		) as string;
		molecule.explorer.setActive([...curActiveExplore, activeExploreId]?.filter(Boolean));
	}
};

const updateParseTree = (molecule: IMoleculeContext, languageService: LanguageService) => {
	const parseTreePanel = molecule.panel.get(PARSE_TREE);
	const group = molecule.editor.getGroups()[0];
	const activeTab = group?.data?.find((item) => item.id === group.activeTab);
	const language = activeTab?.language?.toLocaleLowerCase();

	if (!parseTreePanel || !language || !activeTab) return;
	const sql = activeTab.model?.getValue() || '';

	languageService.getSerializedParseTree(language, sql).then((tree) => {
		molecule.panel.update({
			id: PARSE_TREE,
			data: tree
		});
	});
};

const debounceUpdateParseTree = debounce(updateParseTree, 400);
