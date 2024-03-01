import { IExtension } from '@dtinsight/molecule';
import { POWERED_BY, QUICK_GITHUB, TASK_PATH, TASK_TYPE } from '../const';
import Language from '../workbench/language';
import Path from '../workbench/path';
import PoweredBy from '../workbench/powerBy';
import QuickGithub from '../workbench/github';

export const statusExt: IExtension = {
	id: 'statusExt',
	name: 'statusExt',
	activate(molecule) {
		molecule.statusBar.add({
			id: TASK_TYPE,
			name: '编辑器语言',
			alignment: 'right',
			sortIndex: 12,
			render: () => <Language />
		});
		// FIXME: 空状态不应该有宽度
		molecule.statusBar.add({
			id: TASK_PATH,
			name: '路径',
			alignment: 'left',
			sortIndex: 2,
			render: () => <Path />
		});
		molecule.statusBar.add({
			id: POWERED_BY,
			name: '关于',
			alignment: 'left',
			sortIndex: 1,
			render: () => <PoweredBy />
		});
		molecule.statusBar.add({
			id: QUICK_GITHUB,
			name: 'Github',
			alignment: 'right',
			sortIndex: 3,
			render: () => <QuickGithub />
		});
	}
};
