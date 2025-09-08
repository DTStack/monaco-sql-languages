import './style.css';
import { components } from '@dtinsight/molecule';
import quickStart from '@/assets/quickStart.svg';
import checkDemo from '@/assets/checkDemo.svg';
import checkFile from '@/assets/checkFile.svg';
const Welcome = () => {
	// todo: 点击交互跳转没有实现
	return (
		<div className="welcome">
			<div className="welcome-header">
				<components.Text>dt-sql-parser</components.Text>
			</div>
			<ul>
				<li>
					<img src={quickStart} alt="quickStart" />
					<span>快速开始</span>
				</li>
				<li>
					<img src={checkFile} alt="checkFile" />
					<span>查看接口文档</span>
				</li>
				<li>
					<img src={checkDemo} alt="checkDemo" />
					<span>查看 Demo</span>
				</li>
			</ul>
		</div>
	);
};

export default Welcome;
