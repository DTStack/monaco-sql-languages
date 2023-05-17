import {
	LanguageServiceDefaults,
	LanguageServiceDefaultsImpl,
	diagnosticDefault,
	modeConfigurationDefault
} from './_.contribution';
import { IWorker, WorkerAccessor } from './languageFeatures';
import { WorkerManager } from './workerManager';

type ClientWorker = (...uris: any) => Promise<IWorker>;

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

	private getLanguageServiceDefault(languageId: string): LanguageServiceDefaults {
		return new LanguageServiceDefaultsImpl(
			languageId,
			diagnosticDefault,
			modeConfigurationDefault
		);
	}
}
