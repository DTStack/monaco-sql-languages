import * as monaco from 'monaco-editor';
import { LanguageIdEnum } from 'monaco-sql-languages';
import './languageSetup';

let editorIns: monaco.editor.IStandaloneCodeEditor | null = null;

function render() {
	const container = document.getElementById('container');
	if (container) {
		editorIns = monaco.editor.create(container, {
			language: LanguageIdEnum.TRINO
		});
	}
}

function listenLangChange() {
	const langSelect = document.getElementById('lang-select') as HTMLSelectElement;
	if (langSelect && editorIns) {
		langSelect.addEventListener('change', () => {
			if (!editorIns) return;

			const lang = langSelect.options[langSelect.selectedIndex].value;
			const model = editorIns.getModel();

			if (model && model.getLanguageId() !== lang) {
				monaco.editor.setModelLanguage(model, lang);
				setTimeout(() => {
					console.log(
						'language changed, current is: ',
						editorIns?.getModel()?.getLanguageId()
					);
				}, 200);
			}
		});
	}
}

render();

listenLangChange();
