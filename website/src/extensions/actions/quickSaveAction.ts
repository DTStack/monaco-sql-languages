// FIXME: 直接从根目录导出
import { IMoleculeContext, KeybindingWeight } from '@dtinsight/molecule';
import { BaseAction } from '@dtinsight/molecule/esm/glue';
import { KeyChord, KeyCode, KeyMod } from '@dtinsight/molecule/esm/monaco';
import * as content from '../../storage/content';

export default class QuickSaveAction extends BaseAction {
	static readonly ID = 'workbench.action.quickSave';

	constructor(private molecule: IMoleculeContext) {
		super({
			id: QuickSaveAction.ID,
			title: '快速保存',
			alias: 'Save',
			precondition: undefined,
			f1: true,
			keybinding: {
				when: undefined,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyS)
			}
		});
	}

	run() {
		const molecule = this.molecule;
		const tab = molecule.editor.getCurrentTab();
		const groupId = molecule.editor.getCurrent();
		if (tab && groupId) {
			molecule.editor.updateTab({ id: tab.id, modified: false }, groupId);
			content.set(tab.id as string, tab.value || '');
		}
	}
}
