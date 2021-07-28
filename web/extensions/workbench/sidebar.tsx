import * as React from 'react';
import * as monaco from 'monaco-editor';

import lips from '@jcubic/lips';
import molecule from 'molecule';
import { Button } from 'molecule/esm/components';
import { Select, Option } from 'molecule/esm/components/select';
import {
	builtInStatusProblems,
	IEditorTab,
	IProblemsItem,
	MarkerSeverity
} from 'molecule/esm/model';

import { LanguageService } from '../../../src/languageService';
import { debounce } from '../../../src/_.contribution';
import { defaultLanguage, defaultEditorTab, defaultLanguageStatusItem, languages } from './common';

export default class Sidebar extends React.Component {
	private _language = defaultLanguage;
	private languageService: LanguageService;
	constructor(props) {
		super(props);
		this.languageService = new LanguageService();
	}

	componentDidMount() {
		molecule.editor.onUpdateTab(this.analyseProblems);
	}

	private get language(): string {
		return this._language.toLowerCase();
	}

	onClick = (e, item) => {
		console.log('onClick:', e, item);
	};

	onChangeLanguage = (e, option) => {
		if (option && option.value) {
			this._language = option.value;
			this.updateLanguage(option.value);
		}
	};

	analyseProblems = debounce((tab) => {
		const sql = tab.data.value;
		this.languageService.valid(this.language, sql).then((res) => {
			molecule.problems.updateStatus(
				Object.assign(builtInStatusProblems(), {
					data: {
						error: res?.length | 0
					}
				})
			);
			molecule.problems.clearProblems();
			const problems = this.convertMsgToProblemItem(tab, sql, res);
			problems.forEach((item) => {
				molecule.problems.addProblems(item);
			});
		});
	}, 200);

	convertMsgToProblemItem = (tab: IEditorTab, code, msgs = []): IProblemsItem[] => {
		const problems: IProblemsItem[] = msgs.map((msg) => {
			return {
				id: Number(tab.id),
				name: tab.name,
				value: {
					code: code,
					message: msg.message,
					startLineNumber: Number(msg.startLine),
					startColumn: Number(msg.startCol),
					endLineNumber: Number(msg.endLine),
					endColumn: Number(msg.endLine),
					status: MarkerSeverity.Error
				},
				children: []
			};
		});

		return problems;
	};

	updateLanguage(language: string) {
		const languageId = this.language;

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
		this.setupOutputLanguage();
		const sql = molecule.editor.editorInstance.getValue();
		molecule.panel.clearOutput();

		this.languageService.parserTreeToString(this.language, sql).then((res) => {
			const pre = res?.replace(/(\(|\))/g, '$1\n');
			const format = new lips.Formatter(pre);
			const formatted = format.format({
				indent: 2,
				offset: 2
			});
			console.log('format:', formatted);
			molecule.panel.appendOutput(formatted);
		});
	};

	setupOutputLanguage() {
		const model = molecule.panel.outputEditorInstance.getModel();
		if (model && model.getModeId() !== 'clojure') {
			monaco.editor.setModelLanguage(model, 'clojure');
		}
	}

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
