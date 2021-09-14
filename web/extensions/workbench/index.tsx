import * as React from 'react';
import { IExtension } from 'molecule/esm/model/extension';
import molecule from 'molecule';
import Sidebar from './sidebar';
import { defaultEditorTab, defaultLanguageStatusItem } from './common';
import { Float } from 'molecule/esm/model';

require('../../../src/sparksql/sparksql.contribution');
require('../../../src/flinksql/flinksql.contribution');
require('../../../src/hivesql/hivesql.contribution');
require('../../../src/mysql/mysql.contribution');
require('../../../src/plsql/plsql.contribution');
require('../../../src/sql/sql.contribution');

export const ExtendsWorkbench: IExtension = {
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

		molecule.activityBar.onClick((id: string) => {
			if (id === githubPageActivityBarItem.id) {
				window.location.href = 'https://github.com/DTStack/monaco-sql-languages';
			}
		});

		molecule.editor.open(defaultEditorTab);

		molecule.statusBar.add(defaultLanguageStatusItem, Float.right);
	}
};
