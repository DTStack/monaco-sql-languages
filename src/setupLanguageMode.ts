import { WorkerManager } from './workerManager';
import { LanguageServiceDefaults } from './_.contribution';
import * as languageFeatures from './languageFeatures';
import { Uri, IDisposable } from './fillers/monaco-editor-core';

export function setupLanguageMode<T extends languageFeatures.IWorker>(
	defaults: LanguageServiceDefaults
): IDisposable {
	const disposables: IDisposable[] = [];
	const providers: IDisposable[] = [];

	const client = new WorkerManager(defaults);
	disposables.push(client);

	const worker: languageFeatures.WorkerAccessor<T> = (...uris: Uri[]): Promise<any> => {
		return client.getLanguageServiceWorker(...uris);
	};

	function registerProviders(): void {
		const { languageId, modeConfiguration } = defaults;

		disposeAll(providers);

		if (modeConfiguration.diagnostics) {
			providers.push(new languageFeatures.DiagnosticsAdapter(languageId, worker, defaults));
		}
	}

	registerProviders();

	setupWorkerUrl();

	disposables.push(asDisposable(providers));

	return asDisposable(disposables);
}

function asDisposable(disposables: IDisposable[]): IDisposable {
	return { dispose: () => disposeAll(disposables) };
}

function disposeAll(disposables: IDisposable[]) {
	while (disposables.length) {
		disposables.pop()?.dispose();
	}
}

function setupWorkerUrl() {
	(window as any).MonacoEnvironment = {
		getWorkerUrl: function (moduleId: string, label: string) {
			switch (label) {
				case 'sparksql': {
					return './sparksql.worker.js';
				}
				case 'flinksql': {
					return './flinksql.worker.js';
				}
				default: {
					return './editor.worker.js';
				}
			}
		}
	};
}
