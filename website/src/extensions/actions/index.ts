import { IContributeType, IExtension } from '@dtinsight/molecule';
import QuickSaveAction from './quickSaveAction';
import QuickExecuteAction from './quickExecuteAction';

export const actionsExt: IExtension = {
	id: 'actionsExt',
	name: 'actionsExt',
	contributes: {
		[IContributeType.Commands]: [QuickSaveAction, QuickExecuteAction]
	},
	activate() {
		// TODO
	}
};
