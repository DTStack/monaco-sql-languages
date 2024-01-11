import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	align-items: center;
	.codicon {
		font-size: 20px;
	}
`;

export const Dialog = styled.dialog`
	position: fixed;
	left: 0;
	top: 0;
	z-index: 2600;
	background: rgba(0, 0, 0, 0.3);
	width: 100vw;
	height: 100vh;
	cursor: default;
	margin: 0;
	padding: 0;
`;

export const Boxen = styled.div`
	background: var(--editor-background);
	width: fit-content;
	min-width: 500px;
	max-width: 90vw;
	border-radius: 5px;
	padding: 10px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
`;

export const Row = styled.div`
	display: flex;
	padding: 20px 10px 10px;
	gap: 16px;
`;

export const Text = styled.div`
	flex: 1;
	text-align: center;
	line-height: 40px;
	display: flex;
	flex-direction: column;
`;

export const ButtonRow = styled.div`
	display: flex;
	white-space: nowrap;
	padding: 20px 10px 10px;
	justify-content: flex-end;
`;

export const Link = styled.a`
	font-size: 16px;
	color: var(--foreground);
`;
