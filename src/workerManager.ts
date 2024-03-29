import { LanguageServiceDefaults } from './_.contribution';
import { BaseSQLWorker } from './baseSQLWorker';
import { editor, IDisposable, Uri } from './fillers/monaco-editor-core';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export class WorkerManager<T extends BaseSQLWorker> {
	private _defaults: LanguageServiceDefaults;
	private _idleCheckInterval: number;
	private _lastUsedTime: number;
	private _configChangeListener: IDisposable;

	private _worker: editor.MonacoWebWorker<T> | null;
	private _client: Promise<T> | null;

	constructor(defaults: LanguageServiceDefaults) {
		this._defaults = defaults;
		this._worker = null;
		this._client = null;
		this._idleCheckInterval = window.setInterval(() => this._checkIfIdle(), 30 * 1000);
		this._lastUsedTime = 0;
		this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
	}

	private _stopWorker(): void {
		if (this._worker) {
			this._worker.dispose();
			this._worker = null;
		}
		this._client = null;
	}

	dispose(): void {
		clearInterval(this._idleCheckInterval);
		this._configChangeListener.dispose();
		this._stopWorker();
	}

	private _checkIfIdle(): void {
		if (!this._worker) {
			return;
		}
		let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
		if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
			this._stopWorker();
		}
	}

	private _getClient(): Promise<T> {
		this._lastUsedTime = Date.now();

		if (!this._client) {
			this._worker = editor.createWebWorker<T>({
				// module that exports the create() method and returns a `CSSWorker` instance
				moduleId: this._defaults.languageId,
				label: this._defaults.languageId,

				// passed in to the create() method
				createData: {
					languageId: this._defaults.languageId
				}
			});

			this._client = this._worker.getProxy();
		}

		return this._client;
	}

	getLanguageServiceWorker(..._resources: Uri[]): Promise<T> {
		const resources = _resources?.filter(Boolean);
		return this._getClient().then((client) => {
			if (resources && resources?.length && this._worker) {
				this._worker.withSyncedResources(resources);
			}
			return client;
		});
	}
}
