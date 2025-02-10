import { IExtension } from '@dtinsight/molecule';
import Welcome from '@/components/welcome';

export const mainExt: IExtension = {
	id: 'mainExt',
	name: 'mainExt',
	activate(molecule) {
		molecule.editor.setEntry(<Welcome />);
	}
};
