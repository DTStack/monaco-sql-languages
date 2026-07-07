import 'reflect-metadata';
import { useEffect, useRef } from 'react';
import { create } from '@dtinsight/molecule';
import { version, dependencies } from '../../package.json';
import extensions from './extensions';

import './languages';
import './App.css';
import { editor } from 'monaco-editor';
import {
	createRunStatementButton,
	type RunStatementButtonController
} from 'monaco-sql-languages/esm/main';

/** Demo-only: one controller per editor; dispose on app unmount. Production: dispose in editor unmount. */
const runButtonControllers = new Map<editor.IStandaloneCodeEditor, RunStatementButtonController>();

/**
 * Allow code completion when typing in snippets.
 *
 * You can also set configurations when creating monaco-editor instance
 */
editor.onDidCreateEditor((editorInstance) => {
	const codeEditor = editorInstance as editor.IStandaloneCodeEditor;

	codeEditor.updateOptions({
		suggest: {
			snippetsPreventQuickSuggestions: false
		}
	});

	// languageId is resolved from the model on each refresh; no need to pass it at create time.
	const runButtonController = createRunStatementButton({
		editor: codeEditor,
		glyphMarginHoverMessage: '运行此语句',
		onRun: ({ statement }) => {
			window.console.log('[run-statement-button]', statement.text);
		}
	});

	runButtonControllers.set(codeEditor, runButtonController);
});

const instance = create({
	extensions,
	defaultLocale: 'zh-CN',
	defaultColorTheme: 'sql-dark',
	onigurumPath: '/wasm/onig.wasm'
});

export default function App() {
	const container = useRef<HTMLDivElement>(null);
	useEffect(() => {
		instance.render(container.current);

		return () => {
			runButtonControllers.forEach((controller) => controller.dispose());
			runButtonControllers.clear();
			instance.dispose();
		};
	}, []);
	return <div ref={container} />;
}

window.console.log(
	`%c dt-sql-parser: ${dependencies['dt-sql-parser']} \n\n monaco-sql-languages: ${version}`,
	'font-family: Cabin, Helvetica, Arial, sans-serif;text-align: left;font-size:26px;color:#B21212;'
);
