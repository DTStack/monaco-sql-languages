import type { BaseSQLWorker } from './baseSQLWorker';
import { IDisposable, languages, Uri } from './fillers/monaco-editor-core';
import * as languageFeatures from './languageFeatures';
import { LanguageServiceDefaults } from './monaco.contribution';
import { WorkerManager } from './workerManager';

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

		if (modeConfiguration.references) {
			providers.push(
				languages.registerReferenceProvider(
					languageId,
					new languageFeatures.ReferenceAdapter(worker, defaults)
				)
			);
		}

		if (modeConfiguration.definitions) {
			providers.push(
				languages.registerDefinitionProvider(
					languageId,
					new languageFeatures.DefinitionAdapter(worker, defaults)
				)
			);
		}
		if (modeConfiguration.hover) {
			providers.push(
				languages.registerHoverProvider(
					languageId,
					new languageFeatures.HoverAdapter(worker, defaults)
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
