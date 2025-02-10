import { IContributeType, IExtension } from '@dtinsight/molecule';
import Welcome from '@/components/welcome';
import { FILE_PATH, QUICK_GITHUB, PARSE_LANGUAGE } from '@/consts';
import QuickGithub from '@/components/quickGithub';
import fileIcon from '@/assets/file.svg';
import bugIcon from '@/assets/bug.svg';
import codeIcon from '@/assets/code.svg';

export const mainExt: IExtension = {
	id: 'mainExt',
	name: 'mainExt',
	contributes: {
		[IContributeType.Modules]: {
			menuBar: null
		}
	},
	activate(molecule) {
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
		molecule.editor.setEntry(<Welcome />);

		molecule.activityBar.reset();
		molecule.sidebar.reset();

		molecule.activityBar.add([
			{
				id: 'folder',
				name: '文件夹',
				sortIndex: 1,
				alignment: 'top',
				render: () => <img className="activityBar-imgIcon" src={fileIcon} alt="fileIcon" />
			},
			{
				id: 'sql',
				name: '单测 SQL',
				sortIndex: 2,
				alignment: 'top',
				render: () => <img className="activityBar-imgIcon" src={bugIcon} alt="bugIcon" />
			},
			{
				id: 'api',
				name: '接口文档',
				sortIndex: 3,
				alignment: 'top',
				render: () => <img className="activityBar-imgIcon" src={codeIcon} alt="codeIcon" />
			}
		]);

		molecule.panel.add({
			id: 'problem',
			name: '问题',
			sortIndex: 2,
			render: () => <div style={{ padding: 20 }}>Test</div>
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
	}
};
