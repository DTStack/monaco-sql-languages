import { styled } from 'styled-components';

export const Empty = styled.div`
	padding: 12px;
	font-size: 14px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
`;

export const TreeContainer = styled.div`
	.mo-tree .mo-tree__treenode {
		height: 30px;
		font-size: 14px;
		gap: 6px;

		// FIXME: treenode text-overflow
	}
`;
