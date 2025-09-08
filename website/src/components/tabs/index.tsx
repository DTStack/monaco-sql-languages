import { components } from '@dtinsight/molecule';
import classNames from 'classnames';
import { useState } from 'react';

import './style.css';

interface ITab {
	id: string;
	key: string;
	name: string;
	children: React.ReactNode;
}

interface IProps {
	data: ITab[];
}
const { Header, PanelItem, Prevent } = components;
const Tabs = ({ data }: IProps) => {
	const [currentId, setCurrentId] = useState<string | null>(data[0]?.id);
	const handelChangeTab = (id: string) => {
		setCurrentId(id);
	};
	const getCurrentContent = () => {
		const currentTab = data?.filter((item) => item.id === currentId)?.[0] || null;
		return currentTab?.children || null;
	};
	return (
		<div>
			<Prevent
				onContextMenu={() => {
					console.log('11');
				}}
			>
				<Header className="tabs-header" trackStyle={{ height: 3 }}>
					{data.map((p) => (
						<PanelItem
							key={p.key}
							data={p}
							className={classNames(
								'tabs-item',
								currentId === p.id && 'tabs-item-active '
							)}
							onClick={() => handelChangeTab(p.id)}
						/>
					))}
				</Header>
			</Prevent>
			<div className="tabs-content" tabIndex={0}>
				{getCurrentContent()}
			</div>
		</div>
	);
};

export default Tabs;
