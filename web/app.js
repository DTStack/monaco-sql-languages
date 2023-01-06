import React from 'react';
import ReactDOM from 'react-dom';
import { create, Workbench } from '@dtinsight/molecule';
import '@dtinsight/molecule/esm/style/mo.css';
import { ExtendsWorkbench } from './extensions/workbench';

window.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		switch (label) {
			case 'sparksql': {
				return './sparksql.worker.js';
			}
			case 'flinksql': {
				return './flinksql.worker.js';
			}
			case 'hivesql': {
				return './hivesql.worker.js';
			}
			case 'mysql': {
				return './mysql.worker.js';
			}
			case 'plsql': {
				return './plsql.worker.js';
			}
			case 'pgsql': {
				return './pgsql.worker.js';
			}
			case 'sql': {
				return './sql.worker.js';
			}
			default: {
				return './editor.worker.js';
			}
		}
	}
};

const moInstance = create({
	extensions: [ExtendsWorkbench]
});

const App = () => moInstance.render(<Workbench />);

ReactDOM.render(<App />, document.getElementById('root'));
