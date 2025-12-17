import Tabs from '@/components/tabs';
import { SOURCE_FILE } from '@/consts';
import Parser from './components/parser';
import { IMoleculeContext } from '@dtinsight/molecule';
const SourceSpace = ({ molecule }: { molecule: IMoleculeContext }) => {
	const items = [
		{
			id: SOURCE_FILE,
			key: SOURCE_FILE,
			name: '文件',
			children: <Parser molecule={molecule} />
		}
	];

	return (
		<div>
			<Tabs data={items}></Tabs>
		</div>
	);
};

export default SourceSpace;
