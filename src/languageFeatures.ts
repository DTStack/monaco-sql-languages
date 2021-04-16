import { debounce, LanguageServiceDefaults } from './_.contribution';
import { editor, Uri, IDisposable, MarkerSeverity } from './fillers/monaco-editor-core';

export interface WorkerAccessor<T> {
	(first: Uri, ...more: Uri[]): Promise<T>;
}

export interface IWorker {
	doValidation(uri: string): Promise<any>;
}

export class DiagnosticsAdapter<T extends IWorker> {
	private _disposables: IDisposable[] = [];
	private _listener: { [uri: string]: IDisposable } = Object.create(null);

	constructor(
		private _languageId: string,
		private _worker: WorkerAccessor<T>,
		defaults: LanguageServiceDefaults
	) {
		const onModelAdd = (model: editor.IModel): void => {
			let modeId = model.getModeId();
			if (modeId !== this._languageId) {
				return;
			}

			this._listener[model.uri.toString()] = model.onDidChangeContent(
				debounce(() => {
					this._doValidate(model.uri, modeId);
				}, 500)
			);

			this._doValidate(model.uri, modeId);
		};

		const onModelRemoved = (model: editor.IModel): void => {
			editor.setModelMarkers(model, this._languageId, []);

			let uriStr = model.uri.toString();
			let listener = this._listener[uriStr];
			if (listener) {
				listener.dispose();
				delete this._listener[uriStr];
			}
		};

		this._disposables.push(editor.onDidCreateModel(onModelAdd));
		this._disposables.push(editor.onWillDisposeModel(onModelRemoved));
		this._disposables.push(
			editor.onDidChangeModelLanguage((event) => {
				onModelRemoved(event.model);
				onModelAdd(event.model);
			})
		);

		defaults.onDidChange((_) => {
			editor.getModels().forEach((model) => {
				if (model.getModeId() === this._languageId) {
					onModelRemoved(model);
					onModelAdd(model);
				}
			});
		});

		this._disposables.push({
			dispose: () => {
				for (let key in this._listener) {
					this._listener[key].dispose();
				}
			}
		});

		editor.getModels().forEach(onModelAdd);
	}

	public dispose(): void {
		this._disposables.forEach((d) => d && d.dispose());
		this._disposables = [];
	}

	private _doValidate(resource: Uri, languageId: string): void {
		this._worker(resource)
			.then((worker) => {
				return worker.doValidation(resource.toString());
			})
			.then((diagnostics) => {
				const markers = diagnostics.map((d: any) => toDiagnostics(resource, d));
				let model = editor.getModel(resource);
				if (model && model.getModeId() === languageId) {
					editor.setModelMarkers(model, languageId, markers);
				}
			})
			.then(undefined, (err) => {
				console.error(err);
			});
	}
}

function toSeverity(lsSeverity: number): MarkerSeverity {
	switch (lsSeverity) {
		default:
			return MarkerSeverity.Error;
	}
}

function toDiagnostics(resource: Uri, diag: any): editor.IMarkerData {
	let code = typeof diag.code === 'number' ? String(diag.code) : <string>diag.code;

	return {
		severity: toSeverity(diag.severity),
		startLineNumber: diag.startLine,
		startColumn: diag.startCol,
		endLineNumber: diag.endLine,
		endColumn: diag.endCol,
		message: diag.message,
		code: code,
		source: diag.source
	};
}
