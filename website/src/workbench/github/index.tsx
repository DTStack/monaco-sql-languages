import Space from '../../components/space';
import { components } from '@dtinsight/molecule';

export default function QuickGithub() {
	return (
		<Space
			size={4}
			title="Github"
			onClick={() => window.open('https://github.com/DTStack/monaco-sql-languages')}
		>
			<components.Icon type="github" />
			Github
		</Space>
	);
}
