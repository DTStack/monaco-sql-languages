import 'reflect-metadata';
import { useEffect, useRef } from 'react';
import { create } from '@dtinsight/molecule';
import { version, dependencies } from '../../package.json';
import extensions from './extensions';

import './languages';
import './App.css';

const instance = create({
	extensions,
	defaultLocale: 'zh-CN',
	defaultColorTheme: 'Default Dark+',
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
