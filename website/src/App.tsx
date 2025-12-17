import 'reflect-metadata';
import { useEffect, useRef } from 'react';
import { create } from '@dtinsight/molecule';
import { version, dependencies } from '../../package.json';
import extensions from './extensions';

import './languages';
import './App.css';
import { editor } from 'monaco-editor';

/**
 * Allow code completion when typing in snippets.
 *
 * You can also set configurations when creating monaco-editor instance
 */
editor.onDidCreateEditor((editor) => {
	editor.updateOptions({
		suggest: {
			snippetsPreventQuickSuggestions: false
		}
	});
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
			instance.dispose();
		};
	}, []);
	return <div ref={container} />;
}

window.console.log(
	`%c dt-sql-parser: ${dependencies['dt-sql-parser']} \n\n monaco-sql-languages: ${version}`,
	'font-family: Cabin, Helvetica, Arial, sans-serif;text-align: left;font-size:26px;color:#B21212;'
);
