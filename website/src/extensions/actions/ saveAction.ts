import { BaseAction } from '@dtinsight/molecule/esm/glue';
import { CATEGORIES, KeyChord, KeyCode, KeyMod } from '@dtinsight/molecule/esm/monaco';
import { IMoleculeContext, KeybindingWeight } from '@dtinsight/molecule/esm/types';

// todo： 添加快捷指令， cmd + s 保存文件；
export default class SaveFileAction extends BaseAction {
	static readonly ID = 'editor.item.saveFile';

	constructor(private molecule: IMoleculeContext) {
		super({
			id: SaveFileAction.ID,
			label: molecule.locale.localize('editor.item.saveFile', 'Save File'),
			title: molecule.locale.localize('editor.item.saveFile', 'Save File'),
			category: CATEGORIES.Developer,
			alias: 'Save File',
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
		const curGroup = this.molecule.editor.getCurrentGroup()?.id || -1;
		const curTab = this.molecule.editor.getCurrentTab();
		if (!curTab) return;
		// todo: 修改当前的 tab modified 字段为 false ，并且将当前内容存储在 tab 内；
		this.molecule.editor.updateTab(
			{
				...curTab,
				modified: false
			},
			curGroup
		);
	}
}
