import { UniqueId } from '@dtinsight/molecule';
import { ITreeProps } from '@dtinsight/molecule/esm/client/components';

export interface IProblemsProps<T = any> {
	id: UniqueId;
	name: string;
	isLeaf: boolean;
	data: IProblemsItem<T>[];
	icon?: string;
	show?: boolean;
	expandedKeys?: string[];
	onSelect?: (node: IProblemsTreeNode) => void;
}

interface IProblemsItem<T = any> extends ITreeProps {
	value: IRelatedInformation;
	children: IProblemsItem[];
}

interface IProblemsTreeNode<T = any> extends ITreeProps {
	value?: IRelatedInformation;
	children?: IProblemsTreeNode[];
}

interface IRelatedInformation {
	code: string;
	message: string;
	startLineNumber: number;
	startColumn: number;
	endLineNumber: number;
	endColumn: number;
	status: MarkerSeverity;
}

export enum MarkerSeverity {
	Hint = 1,
	Info = 2,
	Warning = 4,
	Error = 8
}

/**
 * The menu bar event definition
 */
export enum ProblemsEvent {
	onSelect = 'problem.onSelect'
}

export class ProblemModel {
	constructor(public data: IProblemsProps | undefined) {}
}
