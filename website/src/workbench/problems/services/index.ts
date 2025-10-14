import { IProblemsProps, ProblemModel, ProblemsEvent } from '../model';
import { BaseService } from '@dtinsight/molecule/esm/glue';
import { UniqueId } from '@dtinsight/molecule';

export class ProblemsService extends BaseService<ProblemModel> {
	protected state: ProblemModel;
	private listeners = new Set<(data: IProblemsProps[]) => void>();
	constructor() {
		super('problem');
		this.state = new ProblemModel(undefined);
	}

	public get() {
		const data = this.state.data;
		return [data];
	}

	public update(data: IProblemsProps): void {
		{
			this.dispatch((draft) => {
				draft.data = data;
			});
		}
	}

	public toggleRoot(item: IProblemsProps): void {
		this.dispatch((draft) => {
			const root = draft.data;
			if (!root) return draft;
			const isClickRoot = item.name === root.name;
			if (!isClickRoot) return;
			const isCurExpanded = Array.isArray(root.expandedKeys) && root.expandedKeys.length > 0;

			// 返回新对象（新引用）
			return {
				...draft,
				data: {
					...root,
					expandedKeys: isCurExpanded ? [] : [root.name],
					icon: isCurExpanded ? 'chevron-right' : 'chevron-down'
				}
			};
		});
		this.notify();
	}

	public reset() {
		this.setState(new ProblemModel(undefined));
	}

	// ===================== Subscriptions =====================
	/** 手动订阅数据变化 */
	public subscribeData(callback: (data: IProblemsProps[]) => void) {
		this.listeners.add(callback);
		// 初次立即触发一次
		this.state.data && callback([this.state.data]);
		return () => this.listeners.delete(callback);
	}

	private notify() {
		const data = this.state.data;
		if (!data) return;
		for (const fn of this.listeners) fn([data]);
	}

	public onSelect = (callback: (nodeId: UniqueId) => void) => {
		this.subscribe(ProblemsEvent.onSelect, callback);
	};
}
