import * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import { LanguageIdEnum } from 'monaco-sql-languages';
import './languageSetup.ts';

const App = () => {
	const hostRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
	const [lang, setLang] = useState<string>(LanguageIdEnum.FLINK);

	useEffect(() => {
		if (hostRef.current && !editorRef.current) {
			editorRef.current = monaco.editor.create(hostRef.current, {
				language: lang
			});
		}
	}, []);

	useEffect(() => {
		const model = editorRef.current?.getModel();
		if (model && model.getLanguageId() !== lang) {
			monaco.editor.setModelLanguage(model, lang);
			setTimeout(() => {
				console.log(
					'language changed, current is: ',
					editorRef.current?.getModel()?.getLanguageId()
				);
			}, 200);
		}
	}, [lang]);

	return (
		<>
			<h2>ESM Vite Demo</h2>
			<div>
				<select
					name="language"
					value={lang}
					onChange={(e) => {
						setLang(e.target.value);
					}}
					style={{
						width: 120,
						height: 32,
						marginBottom: 8,
						fontSize: 16
					}}
				>
					<option value={LanguageIdEnum.MYSQL}>
						{LanguageIdEnum.MYSQL.toLocaleUpperCase()}
					</option>
					<option value={LanguageIdEnum.FLINK}>
						{LanguageIdEnum.FLINK.replace(/sql/, '').toLocaleUpperCase()}
					</option>
					<option value={LanguageIdEnum.HIVE}>
						{LanguageIdEnum.HIVE.replace(/sql/, '').toLocaleUpperCase()}
					</option>
					<option value={LanguageIdEnum.SPARK}>
						{LanguageIdEnum.SPARK.replace(/sql/, '').toLocaleUpperCase()}
					</option>
					<option value={LanguageIdEnum.IMPALA}>
						{LanguageIdEnum.IMPALA.replace(/sql/, '').toLocaleUpperCase()}
					</option>
					<option value={LanguageIdEnum.TRINO}>
						{LanguageIdEnum.TRINO.replace(/sql/, '').toLocaleUpperCase()}
					</option>
					<option value={LanguageIdEnum.PG}>
						{LanguageIdEnum.PG.toLocaleUpperCase()}
					</option>
				</select>
			</div>
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
