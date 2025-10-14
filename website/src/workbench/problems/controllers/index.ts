import { UniqueId } from '@dtinsight/molecule';
import { BaseController } from '@dtinsight/molecule/esm/glue';

import { injectable } from 'tsyringe';

import { ProblemsEvent } from '../model';

export interface IProblemsController extends BaseController {
	onSelect?(key: UniqueId): void;
}

@injectable()
export class ProblemsController extends BaseController implements IProblemsController {
	constructor() {
		super();
		this.initView();
	}

	private initView() {}

	public readonly onSelect = (key: UniqueId): void => {
		this.emit(ProblemsEvent.onSelect, key);
	};
}
