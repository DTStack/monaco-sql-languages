import 'reflect-metadata';
import React, { useEffect, useRef, useState } from 'react';
import { create, Workbench } from '@dtinsight/molecule';
import InstanceService from '@dtinsight/molecule/esm/services/instanceService';
import { ExtendsWorkbench } from './extensions/workbench';
import { version, dependencies } from '../../package.json';
import { editor } from 'monaco-editor';
import './languages';

import '@dtinsight/molecule/esm/style/mo.css';

import './App.css';

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

function App(): React.ReactElement {
	const refMoInstance = useRef<InstanceService>();
	const [MyWorkbench, setMyWorkbench] = useState<React.ReactElement>();

	useEffect(() => {
		if (!refMoInstance.current) {
			refMoInstance.current = create({
				extensions: [ExtendsWorkbench]
			});
			if (refMoInstance.current) {
				const IDE = () => refMoInstance.current?.render(<Workbench />);
				setMyWorkbench(IDE);
			}
		}
	}, []);

	return <div>{MyWorkbench}</div>;
}

window.console.log(
	`%c dt-sql-parser: ${dependencies['dt-sql-parser']} \n\n monaco-sql-languages: ${version}`,
	'font-family: Cabin, Helvetica, Arial, sans-serif;text-align: left;font-size:26px;color:#B21212;'
);

export default App;
