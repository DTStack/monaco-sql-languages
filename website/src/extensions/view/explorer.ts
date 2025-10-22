import { IExtension } from '@dtinsight/molecule';

export const ExtendsExplorer: IExtension = {
	id: 'Explorer',
	name: 'Extend The Default Explorer',
	contributes: {},
	activate: function (molecule): void {
		molecule.explorer.onPanelToolbarClick((toolbar, panelId) => {
			const {
				EXPLORER_TOOLBAR_CLOSE_ALL,
				EXPLORER_TOOLBAR_SAVE_ALL,
				EXPLORER_ITEM_OPEN_EDITOR
			} = molecule.builtin.getState().constants;
			if (panelId === EXPLORER_ITEM_OPEN_EDITOR) {
				switch (toolbar.id) {
					case EXPLORER_TOOLBAR_CLOSE_ALL: {
						molecule.editor.closeAll();
						break;
					}

					case EXPLORER_TOOLBAR_SAVE_ALL: {
						molecule.editor.getState().groups.forEach((group) => {
							const unsaved = group.data
								.filter((tab) => tab.modified)
								.map((t) => t.id);
							molecule.editor.saveTabs(unsaved, group.id);
						});
						break;
					}

					default:
						break;
				}
			}
		});

		molecule.explorer.onCollapseChange((keys) => {
			molecule.explorer.setActive(keys);
		});
	}
};
