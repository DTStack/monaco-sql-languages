import { useState } from 'react';
import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';
import { LanguageIdEnum } from 'monaco-sql-languages';

// Configure loader to use the local monaco-editor instance
loader.config({ monaco });

const App = () => {
	const [lang, setLang] = useState<string>(LanguageIdEnum.FLINK);
	const [value, setValue] = useState<string>('-- Please enter your SQL here --');

	return (
		<>
			<h2>@monaco-editor/react Demo</h2>
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
				<Editor
					height="100%"
					language={lang}
					value={value}
					onChange={(newValue) => setValue(newValue || '')}
					options={{
						minimap: { enabled: false },
						fontSize: 14
					}}
				/>
			</div>
		</>
	);
};

export default App;
