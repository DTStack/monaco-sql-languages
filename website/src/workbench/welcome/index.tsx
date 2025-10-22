import './style.css';
import { components, IEditorTab, IMoleculeContext } from '@dtinsight/molecule';
import quickStart from '@/assets/quickStart.svg';
import checkDemo from '@/assets/checkDemo.svg';
import { ACTIVITY_API, ACTIVITY_FOLDER, ACTIVITY_SQL, defaultLanguage } from '@/consts';
import { randomId } from '@/utils/tool';

import { Tree } from '@dtinsight/molecule/esm/client/components';
import { initMolecule, openFile, updateExplorer } from '@/services/fileManagerService';
import { IFile } from '../sourceSpace/components/parser';

const Welcome = ({ context: molecule }: { context: IMoleculeContext }) => {
	initMolecule(molecule);
	const switchWorkspaceView = (key: string) => {
		switch (key) {
			case 'quickStart': {
				molecule.sidebar.setCurrent(ACTIVITY_FOLDER);
				molecule.activityBar.setCurrent(ACTIVITY_FOLDER);
				molecule.explorer.setActive([defaultLanguage]);
				const fileName = `${defaultLanguage.toLocaleLowerCase()}_file_${randomId()}.sql`;
				const initFile = {
					name: fileName,
					icon: 'file',
					id: fileName,
					language: defaultLanguage
				};
				openFile(initFile);
				handleUpdateExplorer(initFile);
				molecule.editor.setEntry(null);
				break;
			}
			case 'viewApiDoc':
				molecule.sidebar.setCurrent(ACTIVITY_API);
				molecule.activityBar.setCurrent(ACTIVITY_API);
				break;
			case 'checkDemo':
				molecule.sidebar.setCurrent(ACTIVITY_SQL);
				molecule.activityBar.setCurrent(ACTIVITY_SQL);
				break;
			default:
				break;
		}
	};

	const handleUpdateExplorer = (file: IEditorTab<IFile>) => {
		const { explorerData } = updateExplorer(file) || {};
		molecule.explorer.update({
			id: defaultLanguage,
			render: () => {
				const fileData = explorerData?.[defaultLanguage] as any;
				return !!fileData && <Tree data={fileData} onSelect={openFile}></Tree>;
			}
		});
	};

	return (
		<div className="welcome">
			<div className="welcome-header">
				<components.Text>monaco-sql-languages</components.Text>
			</div>
			<ul>
				<li key={'quickStart'} onClick={() => switchWorkspaceView('quickStart')}>
					<img src={quickStart} alt="quickStart" />
					<span className="text-sm">快速开始</span>
				</li>
				<li key={'viewApiDoc'} onClick={() => switchWorkspaceView('viewApiDoc')}>
					<img src={checkDemo} alt="viewApiDoc" />
					<span className="text-sm">接口文档</span>
				</li>
				<li key={'checkDemo'} onClick={() => switchWorkspaceView('checkDemo')}>
					<img src={checkDemo} alt="checkDemo" />
					<span className="text-sm">查看 Demo</span>
				</li>
			</ul>
		</div>
	);
};

export default Welcome;
