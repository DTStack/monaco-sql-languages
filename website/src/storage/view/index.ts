import { IMoleculeContext } from '@dtinsight/molecule';
import { ExplorerModel } from '@dtinsight/molecule/esm/models/explorer';
import { LayoutModel } from '@dtinsight/molecule/esm/models/layout';
import * as idb from 'idb-keyval';

const tableName = `dtinsight/view`;

type ViewState = {
	layout: LayoutModel;
	explorer: Pick<ExplorerModel, 'active'>;
};

export function set(molecule: IMoleculeContext) {
	const data: ViewState = {
		layout: molecule.layout.getState(),
		explorer: { active: molecule.explorer.getState().active }
	};
	return idb.set(tableName, data);
}

export async function get() {
	return idb.get<ViewState>(tableName);
}
