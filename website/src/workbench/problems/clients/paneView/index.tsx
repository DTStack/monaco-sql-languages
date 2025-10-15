import { memo, useContext, useEffect, useState } from 'react';
import { convertNaNValue, getBEMElement, prefixClaName } from '@/utils/tool';

import { Tree as TreeView, Icon, ScrollBar } from '@dtinsight/molecule/esm/client/components';
import { useLocale } from '@dtinsight/molecule/esm/client/hooks';
import { Context } from '../context';
import { MarkerSeverity } from '../../model';
import '../../style.scss';

const defaultClassName = prefixClaName('problems');
const treeClassName = getBEMElement(defaultClassName, 'treeview');
const treeNodeClassName = getBEMElement(treeClassName, 'treeNode');
const treeNodeBadgeClassName = getBEMElement(treeNodeClassName, 'badge');
const treeLeafClassName = getBEMElement(treeClassName, 'treeLeaf');
const treeLeafSubInfoClassName = getBEMElement(treeLeafClassName, 'subInfo');

function ProblemsPaneView({ problemsService }: { problemsService: any }) {
	const localize = useLocale();
	const [data, setData] = useState(() => problemsService.get());

	useEffect(() => {
		const unsubscribe = problemsService.subscribeData(setData);
		return unsubscribe;
	}, []);
	const context = useContext(Context);
	const { onselect } = context;

	useEffect(() => {
		console.log('组件重新渲染');
	}, [data]);

	if (!data?.length) {
		return (
			<div style={{ margin: '0 18px', userSelect: 'none' }}>
				{localize(
					'panel.problems.empty',
					'No problems have been detected in the workspace.'
				)}
			</div>
		);
	}

	const getIcon = (status: number) => {
		switch (status) {
			case MarkerSeverity.Error: {
				return <Icon type="error" />;
			}
			case MarkerSeverity.Warning: {
				return <Icon type="warning" />;
			}
			case MarkerSeverity.Info: {
				return <Icon type="info" />;
			}
			default: {
				return '';
			}
		}
	};

	return (
		<ScrollBar>
			<div className={defaultClassName}>
				<TreeView
					className={treeClassName}
					expandedKeys={data[0].expandedKeys}
					data={data}
					renderTitle={(item: any) => {
						// todo： item 参数带修复 ts类型
						const value = item.value;
						const children = item.children;
						return !item.isLeaf ? (
							<span className={treeNodeClassName}>
								{item?.name}
								<span className={treeNodeBadgeClassName}>{children?.length}</span>
							</span>
						) : (
							<span className={treeLeafClassName}>
								{getIcon(value.status)}
								<span>{value.message}</span>
								<span className={treeLeafSubInfoClassName}>{value.code}</span>
								<span className={treeLeafSubInfoClassName}>
									[{convertNaNValue(value.startLineNumber)},
									{convertNaNValue(value.startColumn)}]
								</span>
							</span>
						);
					}}
					onSelect={onselect}
				/>
			</div>
		</ScrollBar>
	);
}

export default memo(ProblemsPaneView);
