import { hooks } from '@dtinsight/molecule';
import { Container, Content, Title } from './styled';

export default function SideBar() {
	const Explorer = hooks.useDynamic('explorer');

	return (
		<Container>
			<Title>monaco-sql-languages</Title>
			<Content>{Explorer}</Content>
		</Container>
	);
}
