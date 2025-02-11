import { SOURCE_FILE, SOURCE_OUTLINE } from '@/consts';
import Tabs from 'rc-tabs';
import 'rc-tabs/assets/index.css';
const SourceSpace = () => {
	const callback = (key: string) => {
		console.log(key);
	};

	const items = [
		{
			key: SOURCE_FILE,
			label: '文件',
			children: (
				<div className="text-xl">
					<p>1</p>
				</div>
			)
		},
		{
			key: SOURCE_OUTLINE,
			label: '大纲',
			children: <div>2</div>
		}
	];

	return (
		<div>
			<Tabs
				tabPosition="top"
				items={items}
				defaultActiveKey="1"
				onChange={callback}
				style={{ color: '#F9F9FA' }}
			/>
		</div>
	);
};

export default SourceSpace;
