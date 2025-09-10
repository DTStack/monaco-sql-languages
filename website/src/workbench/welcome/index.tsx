import './style.css';
import { components, IMoleculeContext } from '@dtinsight/molecule';
import quickStart from '@/assets/quickStart.svg';
import checkDemo from '@/assets/checkDemo.svg';
import { ACTIVITY_API, ACTIVITY_FOLDER, ACTIVITY_SQL } from '@/consts';

const Welcome = ({ context: molecule }: { context: IMoleculeContext }) => {
	const handleClickApiDoc = (key: string) => {
		switch (key) {
			case 'quickStart':
				molecule.sidebar.setCurrent(ACTIVITY_FOLDER);
				molecule.activityBar.setCurrent(ACTIVITY_FOLDER);
				break;
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

	return (
		<div className="welcome">
			<div className="welcome-header">
				<components.Text>monaco-sql-languages</components.Text>
			</div>
			<ul>
				<li key={'quickStart'} onClick={() => handleClickApiDoc('quickStart')}>
					<img src={quickStart} alt="quickStart" />
					<span className="text-sm">快速开始</span>
				</li>
				<li key={'viewApiDoc'} onClick={() => handleClickApiDoc('viewApiDoc')}>
					<img src={checkDemo} alt="viewApiDoc" />
					<span className="text-sm">接口文档</span>
				</li>
				<li key={'checkDemo'} onClick={() => handleClickApiDoc('checkDemo')}>
					<img src={checkDemo} alt="checkDemo" />
					<span className="text-sm">查看 Demo</span>
				</li>
			</ul>
		</div>
	);
};

export default Welcome;
