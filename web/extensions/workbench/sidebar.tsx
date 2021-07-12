import * as React from 'react';
import * as monaco from 'monaco-editor';
import FlinkSQL from 'dt-sql-parser/dist/parser/flinksql';

import { Button } from 'molecule/esm/components/button';
import { Select, Option } from 'molecule/esm/components/select';
import { defaultLanguage, defaultLanguageStatusItem, languages } from './common';
import molecule from 'molecule';
import { defaultEditorTab } from './common';

export default class Sidebar extends React.Component {
	private _language = defaultLanguage;
	private flinkSQLParser;
	constructor(props) {
		super(props);
		this.flinkSQLParser = new FlinkSQL();
	}

	componentDidMount() {
		// Update Output language model
		monaco.editor.setModelLanguage(
			molecule.panel.outputEditorInstance?.getModel(),
			'typescript'
		);
	}

	onClick = (e, item) => {
		console.log('onClick:', e, item);
	};

	onChangeLanguage = (e, option) => {
		if (option && option.value) {
			console.log('onChangeTheme:', option.value);
			this._language = option.value;
			this.updateLanguage(option.value);
		}
	};

	updateLanguage(language: string) {
		const languageId = language.toLowerCase();

		const nextTab = Object.assign(defaultEditorTab, {
			name: language,
			data: { language: languageId, value: '' }
		});
		const group = molecule.editor.getState().current?.id || -1;
		molecule.editor.updateTab(nextTab, group);
		monaco.editor.setModelLanguage(molecule.editor.editorInstance?.getModel(), languageId);

		const nextStatusItem = Object.assign(defaultLanguageStatusItem, {
			name: language,
			sortIndex: 3
		});

		molecule.statusBar.updateItem(nextStatusItem);
	}

	parse = () => {
		const sql = molecule.editor.editorInstance.getValue();
		const result = this.flinkSQLParser.parserTreeToString(sql);
		// Setup Console language
		molecule.panel.clearOutput();
		molecule.panel.appendOutput(result);
	};

	renderColorThemes() {
		const options = languages.map((language: string) => {
			return (
				<Option key={language} value={language}>
					{language}
				</Option>
			);
		});
		return (
			<Select
				style={{ margin: '10px 4px 20px 4px' }}
				defaultValue={this._language}
				onSelect={this.onChangeLanguage}
			>
				{options}
			</Select>
		);
	}

	render() {
		return (
			<div>
				<div style={{ margin: '20px 20px' }}>
					<h1 style={{ fontSize: 20, textTransform: 'uppercase' }}>
						Select a language:{' '}
					</h1>
					{this.renderColorThemes()}
					<Button onClick={this.parse}>Parse</Button>
				</div>
			</div>
		);
	}
}
