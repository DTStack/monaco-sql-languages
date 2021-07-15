import {
	ModeConfiguration,
	DiagnosticsOptions,
	LanguageServiceDefaults,
	LanguageServiceDefaultsImpl
} from '../../../src/_.contribution';
import { IWorker, WorkerAccessor } from '../../../src/languageFeatures';
import { WorkerManager } from '../../../src/workerManager';

const modeConfigurationDefault: Required<ModeConfiguration> = {
	completionItems: true,
	hovers: true,
	documentSymbols: true,
	definitions: true,
	references: true,
	documentHighlights: true,
	rename: true,
	colors: true,
	foldingRanges: true,
	diagnostics: true,
	selectionRanges: true
};

const diagnosticDefault: Required<DiagnosticsOptions> = {
	validate: true
};

type ClientWorker = (...uris) => Promise<IWorker>;

export class LanguageService {
	private worker: Map<string, WorkerAccessor<any>> = new Map();

	public valid(language: string, sqlContent: string): Promise<any> {
		const clientWorker = this.getClientWorker(language);
		return clientWorker(sqlContent).then((worker) => {
			return worker.valid(sqlContent);
		});
	}

	public parserTreeToString(language: string, sqlContent: string): Promise<any> {
		const clientWorker = this.getClientWorker(language);
		return clientWorker(sqlContent).then((worker) => {
			return worker.parserTreeToString(sqlContent);
		});
	}

	private getClientWorker(language: string): ClientWorker {
		let existWorker = this.worker.get(language);
		if (!existWorker) {
			const client = new WorkerManager(this.getLanguageServiceDefault(language));
			const worker: WorkerAccessor<any> = (...uris): Promise<any> => {
				return client.getLanguageServiceWorker(...uris);
			};
			this.worker.set(language, worker);
			return worker;
		}
		return existWorker;
	}

	private getLanguageServiceDefault(languageId): LanguageServiceDefaults {
		return new LanguageServiceDefaultsImpl(
			languageId,
			diagnosticDefault,
			modeConfigurationDefault
		);
	}
}
