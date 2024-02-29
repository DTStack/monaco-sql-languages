import { PropsWithChildren } from 'react';
import { Container } from './styled';

interface ISpaceProps {
	size?: number;
}

export default function Space({ children, size = 8 }: PropsWithChildren<ISpaceProps>) {
	return <Container gap={size}>{children}</Container>;
}
