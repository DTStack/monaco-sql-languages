import styled from 'styled-components';

export const Container = styled.div`
	background-color: var(--sideBar-background);
	height: 100%;
	border-right: 1px solid var(--sideBar-border);
	color: var(--sideBar-foreground);
	outline-color: var(--sideBar-border);
`;

export const Title = styled.div`
	height: 35px;
	text-align: center;
	line-height: 35px;
	user-select: none;
	font-size: 14px;
`;

export const Content = styled.div`
	height: calc(100% - 35px);
`;
