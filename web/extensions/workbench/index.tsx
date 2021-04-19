import * as React from 'react';
import { IExtension } from 'molecule/esm/model/extension';
import '../../../src/flinksql/flinksql.contribution';
import '../../../src/sparksql/sparksql.contribution';
import { activityBarService, sidebarService, editorService, statusBarService } from 'molecule';
import {
	CONTEXT_MENU_EXPLORER,
	CONTEXT_MENU_SEARCH
} from 'molecule/esm/model/workbench/activityBar';

import Sidebar from './sidebar';
import { defaultEditorTab, defaultLanguageStatusItem } from './common';

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

		activityBarService.remove(CONTEXT_MENU_EXPLORER.id);
		activityBarService.remove(CONTEXT_MENU_SEARCH.id);

		activityBarService.addBar(parserActivityBarItem);
		activityBarService.setState({
			selected: parserActivityBarItem.id
		});

		editorService.open(defaultEditorTab);

		statusBarService.appendRightItem(defaultLanguageStatusItem);
	}
};
