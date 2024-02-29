import styled from 'styled-components';

export const Container = styled.div<{ gap: number }>`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${({ gap }) => `${gap}px`};
`;
