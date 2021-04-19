import * as React from 'react';
import * as monaco from 'monaco-editor';
import { FlinkSQL } from 'dt-sql-parser';

import { Button } from 'molecule/esm/components/button';
import { Select, Option } from 'molecule/esm/components/select';
import { defaultLanguage, defaultLanguageStatusItem, languages } from './common';
import { editorService, panelService, statusBarService } from 'molecule';
import { defaultEditorTab } from './common';

export default class Sidebar extends React.Component {
	private _language = defaultLanguage;
	private flinkSQLParser;
	constructor(props) {
		super(props);
		this.flinkSQLParser = new FlinkSQL();
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
		const group = editorService.getState().current?.id || -1;
		editorService.updateTab(nextTab, group);
		monaco.editor.setModelLanguage(editorService.editorInstance?.getModel(), languageId);

		const nextStatusItem = Object.assign(defaultLanguageStatusItem, {
			name: language
		});

		statusBarService.updateItem(nextStatusItem);
	}

	parse = () => {
		// TODO There need declare different SQL parser
		const sql = editorService.editorInstance.getValue();
		const result = this.flinkSQLParser.parserTreeToString(sql);
		// const parser = new GenericSQL();
		// const resultValidation = parser.validate(sql);
		panelService.clearOutput();
		panelService.appendOutput(result);
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
