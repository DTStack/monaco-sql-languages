import { BaseAction } from '@dtinsight/molecule/esm/glue';
import { CATEGORIES, KeyChord, KeyCode, KeyMod } from '@dtinsight/molecule/esm/monaco';
import { IMoleculeContext, KeybindingWeight } from '@dtinsight/molecule/esm/types';
import { editor as monaco } from 'monaco-editor/esm/vs/editor/editor.api';
import { vsPlusTheme } from 'monaco-sql-languages/esm/main';

export default class ToggleThemeAction extends BaseAction {
	static readonly ID = 'workbench.action.toggleTheme';

	constructor(private molecule: IMoleculeContext) {
		super({
			id: ToggleThemeAction.ID,
			label: molecule.locale.localize('workbench.action.toggleTheme', 'Toggle Theme'),
			title: molecule.locale.localize('workbench.action.toggleTheme', 'Toggle Theme'),
			category: CATEGORIES.View,
			alias: 'Toggle Theme',
			precondition: undefined,
			f1: true,
			keybinding: {
				when: undefined,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK)
			}
		});
	}

	run() {
		const current = this.molecule.colorTheme.getCurrentTheme()?.id;
		const next = current === 'sql-dark' ? 'Default Dark+' : 'sql-dark';
		this.molecule.colorTheme.setCurrent(next);
		if (next === 'sql-dark') {
			monaco.defineTheme('sql-dark', vsPlusTheme.darkThemeData);
			monaco.setTheme('sql-dark');
		} else {
			monaco.setTheme('vs-dark');
		}
		// 强制刷新所有模型的语法高亮
		monaco.getModels().forEach((model) => {
			const lang = model.getLanguageId();
			monaco.setModelLanguage(model, lang);
		});
		// 同步状态栏切换按钮文本（若存在）
		this.molecule.statusBar.update({ id: 'toggle-theme', name: next });
	}
}
