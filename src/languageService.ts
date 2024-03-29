import {
	LanguageServiceDefaults,
	LanguageServiceDefaultsImpl,
	diagnosticDefault,
	modeConfigurationDefault
} from './_.contribution';
import { WorkerManager } from './workerManager';
import { BaseSQLWorker } from './baseSQLWorker';
import { Position, Uri, editor } from './fillers/monaco-editor-core';

export class LanguageService<T extends BaseSQLWorker = BaseSQLWorker> {
	private workerClients: Map<string, WorkerManager<T>> = new Map();

	public valid(language: string, model: editor.IReadOnlyModel | string) {
		const text = typeof model === 'string' ? model : model.getValue();
		const uri = typeof model === 'string' ? void 0 : model.uri;

		const clientWorker = this.getClientWorker(language, uri as Uri);
		return clientWorker.then((worker) => {
			return worker.doValidation(text);
		});
	}

	public parserTreeToString(language: string, model: editor.IReadOnlyModel | string) {
		const text = typeof model === 'string' ? model : model.getValue();
		const uri = typeof model === 'string' ? void 0 : model.uri;

		const clientWorker = this.getClientWorker(language, uri as Uri);
		return clientWorker.then((worker) => {
			return worker.parserTreeToString(text);
		});
	}

	public getAllEntities(
		language: string,
		model: editor.IReadOnlyModel | string,
		position?: Position
	) {
		const text = typeof model === 'string' ? model : model.getValue();
		const uri = typeof model === 'string' ? void 0 : model.uri;

		const clientWorker = this.getClientWorker(language, uri as Uri);
		return clientWorker.then((worker) => {
			return worker.getAllEntities(text, position);
		});
	}

	/**
	 * Dispose a language service.
	 * If the language is null, dispose all language services.
	 */
	public dispose(language?: string): void {
		if (language) {
			if (this.workerClients.has(language)) {
				this.workerClients.get(language)?.dispose();
				this.workerClients.delete(language);
			}
		} else {
			this.workerClients.forEach((client) => {
				client.dispose();
			});
			this.workerClients.clear();
		}
	}

	private getClientWorker(language: string, ...uri: Uri[]): Promise<T> {
		let existClient = this.workerClients.get(language);
		if (!existClient) {
			const client = new WorkerManager<T>(this.getLanguageServiceDefault(language));
			this.workerClients.set(language, client);
			return client.getLanguageServiceWorker(...uri);
		}
		return existClient.getLanguageServiceWorker(...uri);
	}

	private getLanguageServiceDefault(languageId: string): LanguageServiceDefaults {
		return new LanguageServiceDefaultsImpl(
			languageId,
			diagnosticDefault,
			modeConfigurationDefault
		);
	}
}
