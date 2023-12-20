import * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';
import { LanguageIdEnum } from 'monaco-sql-languages';

const App = () => {
	const hostRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

	useEffect(() => {
		if (hostRef.current && !editorRef.current) {
			editorRef.current = monaco.editor.create(hostRef.current, {
				language: LanguageIdEnum.FLINK
			});
		}
	}, []);

	return (
		<>
			<h2>FlinkSQL Demo</h2>
			<div
				style={{
					width: 700,
					height: 400,
					border: '1px solid #ddd'
				}}
			>
				<div ref={hostRef} style={{ height: '100%', width: '100%' }} />
			</div>
		</>
	);
};

export default App;
