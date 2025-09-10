import { IExtension } from '@dtinsight/molecule';

export const ExtendsExplorer: IExtension = {
	id: 'Explorer',
	name: 'Extend The Default Explorer',
	contributes: {},
	activate: function (molecule): void {
		molecule.explorer.onPanelToolbarClick((toolbar, panelId) => {
			if (panelId === 'FlinkSQL') {
				switch (toolbar.id) {
					case 'explorer.contextMenu.createFile': {
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
