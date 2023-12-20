import * as monaco from 'monaco-editor';
import { LanguageIdEnum } from 'monaco-sql-languages';
import './languageSetup';

function render() {
	const container = document.getElementById('container');
	if (container) {
		monaco.editor.create(container, {
			language: LanguageIdEnum.FLINK
		});
	}
}

render();
