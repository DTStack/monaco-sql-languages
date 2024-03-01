import styled from 'styled-components';

export const Container = styled.div`
	height: 100%;
	position: relative;
	width: 100%;
`;

export const Title = styled.div`
	line-height: 24px;
	font-size: 14px;
	padding: 6px 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	flex: 1;
`;

export const EditorWrapper = styled.div`
	height: calc(100% - 38px);
`;

export const Actions = styled.div`
	padding: 0 6px;
`;

export const Header = styled.div`
	display: flex;
	width: 100%;
`;

export const Name = styled.div`
	cursor: pointer;
	max-width: 400px;
`;

export const Text = styled.div`
	border: 1px solid transparent;
	padding: 0 6px;
	border-radius: 5px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	&:hover {
		border-color: var(--inputOption-activeBorder);
	}
`;
