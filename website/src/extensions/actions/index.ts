import { IContributeType, IExtension, IMenuItemProps, UniqueId } from '@dtinsight/molecule';
import SaveFileAction from './ saveAction';
import { concatMenu } from '@dtinsight/molecule/esm/utils';

export const ExtendsActions: IExtension = {
	id: 'ExtendsActions',
	name: 'Extend Actions',
	contributes: {
		[IContributeType.Commands]: [SaveFileAction]
	},
	activate: function (molecule): void {
		appendActionGroupBy(molecule.builtin.getConstants().MENUBAR_ITEM_EDIT)
			.with(SaveFileAction)
			.exhaust();

		function appendActionGroupBy(parentId: UniqueId) {
			const items: IMenuItemProps[] = [];
			return new (class {
				with = (ctor: { ID: string }) => {
					const keybinding = molecule.action.queryGlobalKeybinding(ctor.ID);

					items.push({
						id: ctor.ID,
						name: molecule.locale.localize(ctor.ID, ctor.ID),
						keybinding: keybinding
							? molecule.action.convertSimpleKeybindingToString(keybinding)
							: undefined
					});
					return this;
				};
				exhaust = () => {
					const menuItems = concatMenu(
						molecule.menuBar.get(parentId)?.children || [],
						items
					);
					molecule.menuBar.update(parentId, () => ({
						children: menuItems
					}));
				};
			})();
		}
	}
};
