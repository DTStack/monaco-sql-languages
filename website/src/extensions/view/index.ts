import { IExtension } from '@dtinsight/molecule';
import * as view from '../../storage/view';

export const viewExt: IExtension = {
	id: 'viewExt',
	name: 'viewExt',
	activate(molecule) {
		view.get().then((viewState) => {
			if (viewState?.explorer) {
				molecule.explorer.setActive(viewState.explorer.active);
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
