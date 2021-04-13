import React from 'react';
import ReactDOM from 'react-dom';
import { MoleculeProvider, Workbench } from 'molecule';
import 'molecule/esm/style/mo.css';
import { ExtendsWorkbench } from './extensions/workbench';

const App = () => (
	<MoleculeProvider extensions={[ExtendsWorkbench]}>
		<Workbench />
	</MoleculeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
