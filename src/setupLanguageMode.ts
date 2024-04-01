import { WorkerManager } from './workerManager';
import { LanguageServiceDefaults } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';
import { Uri, IDisposable, languages } from './fillers/monaco-editor-core';
import type { BaseSQLWorker } from './baseSQLWorker';

export function setupLanguageMode<T extends BaseSQLWorker>(
	defaults: LanguageServiceDefaults
): IDisposable {
	const disposables: IDisposable[] = [];
	const providers: IDisposable[] = [];

	const client = new WorkerManager<T>(defaults);
	disposables.push(client);

	const worker: languageFeatures.WorkerAccessor<T> = (...uris: Uri[]) => {
		return client.getLanguageServiceWorker(...uris);
	};

	function registerProviders(): void {
		const { languageId, modeConfiguration } = defaults;

		disposeAll(providers);

		if (modeConfiguration.diagnostics) {
			providers.push(new languageFeatures.DiagnosticsAdapter(languageId, worker, defaults));
		}

		if (modeConfiguration.completionItems.enable) {
			providers.push(
				languages.registerCompletionItemProvider(
					languageId,
					new languageFeatures.CompletionAdapter(worker, defaults)
				)
			);
		}
	}

	registerProviders();

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
