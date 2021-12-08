import * as React from 'react';
import * as monaco from 'monaco-editor';

import lips from '@jcubic/lips';
import molecule from '@dtinsight/molecule';
import { Button } from '@dtinsight/molecule/esm/components';
import { Select, Option } from '@dtinsight/molecule/esm/components/select';
import { IEditorTab, IProblemsItem, MarkerSeverity } from '@dtinsight/molecule/esm/model';

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
			molecule.problems.reset();
			const problems = this.convertMsgToProblemItem(tab, sql, res);
			molecule.problems.add(problems);
		});
	}, 200);

	convertMsgToProblemItem = (tab: IEditorTab, code, msgs = []): IProblemsItem => {
		const rootId = Number(tab.id);
		const rootName = `${tab.name || ''}`;
		const languageProblems: IProblemsItem = {
			id: rootId,
			name: rootName,
			value: {
				code: rootName,
				message: '',
				startLineNumber: 0,
				startColumn: 1,
				endLineNumber: 0,
				endColumn: 1,
				status: MarkerSeverity.Hint
			},
			children: []
		};

		languageProblems.children = msgs.map((msg: any, index: number) => {
			return {
				id: rootId + index,
				name: code || '',
				value: {
					code: '',
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

		return languageProblems;
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
		this.analyseProblems(nextTab);
		molecule.statusBar.update(nextStatusItem);
	}

	parse = () => {
		this.setupOutputLanguage();
		const sql = molecule.editor.editorInstance.getValue();
		molecule.panel.cleanOutput();

		this.languageService.parserTreeToString(this.language, sql).then((res) => {
			const pre = res?.replace(/(\(|\))/g, '$1\n');
			const format = new lips.Formatter(pre);
			const formatted = format.format({
				indent: 2,
				offset: 2
			});
			molecule.panel.appendOutput(formatted);
		});
	};

	async setupOutputLanguage() {
		const editorIns = await molecule.panel.outputEditorInstance;
		if (editorIns) {
			monaco.editor.setModelLanguage(editorIns.getModel(), 'clojure');
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
