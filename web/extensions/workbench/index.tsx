import * as React from 'react';
import { IExtension } from 'molecule/esm/model/extension';
import { activityBarService, sidebarService, editorService, statusBarService } from 'molecule';

import Sidebar from './sidebar';
import { defaultEditorTab, defaultLanguage, defaultLanguageStatusItem } from './common';

export const ExtendsWorkbench: IExtension = {
	activate() {
		const ParserSidebar = {
			id: 'ParserSidebar',
			title: 'Sidebar',
			render() {
				return <Sidebar />;
			}
		};

		sidebarService.push(ParserSidebar);
		sidebarService.setState({
			current: ParserSidebar.id
		});

		const parserActivityBarItem = {
			id: 'OnlineParser',
			iconName: 'codicon-beaker',
			name: 'SQL Languages Online Parse'
		};

		activityBarService.addBar(parserActivityBarItem);
		activityBarService.setState({
			selected: parserActivityBarItem.id
		});

		editorService.open(defaultEditorTab);

		statusBarService.appendRightItem(defaultLanguageStatusItem);
	}
};
