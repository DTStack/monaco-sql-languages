import * as React from 'react';

import { Button } from 'molecule/esm/components/button';
import { Select, Option } from 'molecule/esm/components/select';
import { defaultLanguage, defaultLanguageStatusItem, languages } from './common';
import { editorService, statusBarService } from 'molecule';
import { defaultEditorTab } from './common';

export default class Sidebar extends React.Component {
	private _language = defaultLanguage;

	constructor(props) {
		super(props);
	}

	onClick = (e, item) => {
		console.log('onClick:', e, item);
	};

	onChangeLanguage = (e, option) => {
		if (option && option.value) {
			console.log('onChangeTheme:', option.value);
			this._language = option.value;
			const nextTab = Object.assign(defaultEditorTab, {
				name: option.value,
				data: { language: option.value.toLowerCase(), value: '' }
			});
			editorService.updateTab(nextTab);

			const nextStatusItem = Object.assign(defaultLanguageStatusItem, {
				name: option.value
			});

			statusBarService.updateItem(nextStatusItem);
		}
	};

	parse = () => {};

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
					<h1 style={{ fontSize: 20 }}>Select a language: </h1>
					{this.renderColorThemes()}
					<Button onClick={this.parse}>Parse</Button>
				</div>
			</div>
		);
	}
}
