import molecule from '@dtinsight/molecule';
import { Float } from '@dtinsight/molecule/esm/model';
import { IExtension } from '@dtinsight/molecule/esm/model/extension';
import Sidebar from './sidebar';
import { defaultEditorTab, defaultLanguageStatusItem } from './common';

export const ExtendsWorkbench: IExtension = {
	id: 'ExtendWorkbench',
	name: 'ExtendWorkbench',

	activate() {
		const ParserSidebar = {
			id: 'ParserSidebar',
			title: 'Sidebar',
			render() {
				return <Sidebar />;
			}
		};

		molecule.sidebar.add(ParserSidebar);
		molecule.sidebar.setState({
			current: ParserSidebar.id
		});

		const parserActivityBarItem = {
			id: 'OnlineParser',
			icon: 'beaker',
			title: 'SQL Languages Online Parse'
		};

		const githubPageActivityBarItem = {
			id: 'GotoGithub',
			icon: 'github',
			title: 'Go To Github'
		};

		molecule.activityBar.remove('sidebar.explore.title');
		molecule.activityBar.remove('sidebar.search.title');

		molecule.activityBar.add([parserActivityBarItem, githubPageActivityBarItem]);
		molecule.activityBar.setState({
			selected: parserActivityBarItem.id
		});

		molecule.activityBar.onClick((id) => {
			if (id === githubPageActivityBarItem.id) {
				window.location.href = 'https://github.com/DTStack/monaco-sql-languages';
			}
		});

		molecule.editor.open(defaultEditorTab);

		molecule.statusBar.add(defaultLanguageStatusItem, Float.right);
	},
	dispose() {}
};
