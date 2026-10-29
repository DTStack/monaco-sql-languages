import { IExtension } from '@dtinsight/molecule';
import * as view from '../../storage/view';

export const viewExt: IExtension = {
	id: 'viewExt',
	name: 'viewExt',
	activate(molecule) {
		view.get().then((viewState) => {
			if (viewState?.explorer) {
				// Molecule Collapse.performSizes crashes if active contains ids
				// that are no longer in explorer.data (stale IndexedDB after panel list changes).
				const validIds = new Set(molecule.explorer.getAll().map((item) => item.id));
				molecule.explorer.setActive(
					(viewState.explorer.active || []).filter((id) => validIds.has(id))
				);
			}
			if (viewState?.layout) {
				molecule.layout.setState(viewState.layout);
			}
		});
	},
	dispose(molecule) {
		view.set(molecule);
	}
};
