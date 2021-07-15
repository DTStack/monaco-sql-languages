import * as React from 'react';
import { IExtension } from 'molecule/esm/model/extension';

import molecule from 'molecule';

import Sidebar from './sidebar';
import { defaultEditorTab, defaultLanguageStatusItem } from './common';

require('../../../src/flinksql/flinksql.contribution');
require('../../../src/hivesql/hivesql.contribution');
require('../../../src/sparksql/sparksql.contribution');
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

		molecule.sidebar.addPane(ParserSidebar);
		molecule.sidebar.setState({
			current: ParserSidebar.id
		});

		const parserActivityBarItem = {
			id: 'OnlineParser',
			iconName: 'codicon-beaker',
			title: 'SQL Languages Online Parse'
		};

		const githubPageActivityBarItem = {
			id: 'GotoGithub',
			iconName: 'codicon-github',
			title: 'Go To Github'
		};

		molecule.activityBar.remove('sidebar.explore.title');
		molecule.activityBar.remove('sidebar.search.title');

		molecule.activityBar.addBar([parserActivityBarItem, githubPageActivityBarItem]);
		molecule.activityBar.setState({
			selected: parserActivityBarItem.id
		});

		molecule.activityBar.onClick((id: string) => {
			if (id === githubPageActivityBarItem.id) {
				window.location.href = 'https://github.com/DTStack/monaco-sql-languages';
			}
		});

		molecule.editor.open(defaultEditorTab);

		molecule.statusBar.appendRightItem(defaultLanguageStatusItem);
	}
};
