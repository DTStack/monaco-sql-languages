import { HTMLAttributes, PropsWithChildren } from 'react';
import { Container } from './styled';

interface ISpaceProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
}

export default function Space({ children, size = 8, ...rest }: PropsWithChildren<ISpaceProps>) {
	return (
		<Container gap={size} {...rest}>
			{children}
		</Container>
	);
}
