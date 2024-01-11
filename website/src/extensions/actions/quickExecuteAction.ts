import { IMoleculeContext, KeybindingWeight } from '@dtinsight/molecule';
// FIXME: 直接从根目录导出
import { BaseAction } from '@dtinsight/molecule/esm/glue';
import { KeyChord, KeyCode, KeyMod } from '@dtinsight/molecule/esm/monaco';
import lips from '@jcubic/lips';
import { RUN_SQL_ID } from '../../const';

export default class QuickExecuteAction extends BaseAction {
	static readonly ID = 'workbench.action.quickExecute';

	constructor(private molecule: IMoleculeContext) {
		super({
			id: QuickExecuteAction.ID,
			title: '快速执行',
			alias: 'execute',
			precondition: undefined,
			f1: true,
			keybinding: {
				when: undefined,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Enter)
			}
		});
	}

	run() {
		const molecule = this.molecule;
		// TODO
		const group = molecule.editor.getCurrentGroup();
		// FIXME: 这个函数应该支持范型
		const tab = molecule.editor.getCurrentTab();
		if (!group?.editorInstance || !tab) return;
		const instance = group.editorInstance;
		// 获取全部文本
		const text = instance.getModel()?.getValue() || '';
		molecule.editor.updateToolbar({
			id: RUN_SQL_ID,
			icon: 'loading~spin'
		});
		import('monaco-sql-languages/out/esm/languageService')
			.then(({ LanguageService }) => {
				const languageService = new LanguageService();
				return languageService.parserTreeToString(tab.language!, text);
			})
			.then((res) => {
				const pre = res?.replace(/(\(|\))/g, '$1\n');
				const format = new lips.Formatter(pre);
				const formatted = format.format({
					indent: 2,
					offset: 2
				});
				molecule.layout.setPanel(true);
				molecule.output.append(formatted);
			})
			.finally(() => {
				molecule.editor.updateToolbar({
					id: RUN_SQL_ID,
					icon: 'run'
				});
			});
	}
}
