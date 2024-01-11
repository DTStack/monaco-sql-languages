import { IExtension } from '@dtinsight/molecule';
import * as view from '../../storage/view';

export const viewExt: IExtension = {
	id: 'viewExt',
	name: 'viewExt',
	activate(molecule) {
		// FIXME：如果调用了 dispose 方法这里就不需要调用了
		molecule.explorer.onCollapseChange(() => {
			window.setTimeout(() => {
				view.set(molecule);
			}, 0);
		});

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
		// FIXME: Molecule 的实例调用 dispose 应该把每一个插件的 dispose 方法都调用一次
		// window.setTimeout(() => {
		// 	view.set(molecule);
		// }, 0);
	}
};
