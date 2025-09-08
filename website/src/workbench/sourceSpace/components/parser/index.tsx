import { slots } from '@dtinsight/molecule';
const { Explorer } = slots;
import './style.css';

const Parser = ({ molecule }) => {
	return (
		<div className="folder-tree">
			<Explorer {...molecule}></Explorer>
		</div>
	);
};

export default Parser;
