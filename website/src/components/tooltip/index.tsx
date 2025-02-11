import { useEffect } from 'react';
import './style.css';

interface IProps {
	children: React.ReactNode;
	values: { href: string; title: string }[];
}

const Tooltip = ({ children, values }: IProps) => {
	useEffect(() => {
		const tooltip = document.querySelector('.tooltip');
		if (!tooltip) return;
		tooltip.addEventListener('mouseenter', () => {
			const content = document.querySelector('.tooltip-content');
			if (!content) return;
			content.classList.add('tooltip-show');
		});
		tooltip.addEventListener('mouseleave', () => {
			const content = document.querySelector('.tooltip-content');
			if (!content) return;
			content.classList.remove('tooltip-show');
		});
	}, []);
	return (
		<div className="tooltip">
			<div className="tooltip-trigger">{children}</div>
			<ul className="tooltip-content">
				{values.map((item, index) => (
					<li>
						<a key={index} href={item.href} target="_blank" rel="noreferrer">
							{item.title}
						</a>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 14 14"
							fill="none"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M2.84375 1.53125C2.11888 1.53125 1.53125 2.11888 1.53125 2.84375V11.1562C1.53125 11.8811 2.11888 12.4688 2.84375 12.4688H6.125C6.36662 12.4688 6.5625 12.2729 6.5625 12.0312C6.5625 11.7896 6.36662 11.5938 6.125 11.5938H2.84375C2.60213 11.5938 2.40625 11.3979 2.40625 11.1562V5.90625H11.5938V6.78125C11.5938 7.02287 11.7896 7.21875 12.0312 7.21875C12.2729 7.21875 12.4688 7.02287 12.4688 6.78125V2.84375C12.4688 2.11888 11.8811 1.53125 11.1562 1.53125H2.84375ZM11.5938 5.03125V2.84375C11.5938 2.60213 11.3979 2.40625 11.1562 2.40625H2.84375C2.60213 2.40625 2.40625 2.60213 2.40625 2.84375V5.03125H11.5938ZM3.82812 4.375C4.13016 4.375 4.375 4.13016 4.375 3.82812C4.375 3.52609 4.13016 3.28125 3.82812 3.28125C3.52609 3.28125 3.28125 3.52609 3.28125 3.82812C3.28125 4.13016 3.52609 4.375 3.82812 4.375ZM6.125 3.82812C6.125 4.13016 5.88016 4.375 5.57812 4.375C5.27609 4.375 5.03125 4.13016 5.03125 3.82812C5.03125 3.52609 5.27609 3.28125 5.57812 3.28125C5.88016 3.28125 6.125 3.52609 6.125 3.82812ZM10.1 8.85938L7.78439 11.175C7.61354 11.3459 7.61354 11.6229 7.78439 11.7937C7.95525 11.9646 8.23225 11.9646 8.40311 11.7937L10.7188 9.47809V10.6094C10.7188 10.851 10.9146 11.0469 11.1562 11.0469C11.3979 11.0469 11.5938 10.851 11.5938 10.6094V8.42188C11.5938 8.18025 11.3979 7.98438 11.1562 7.98438H8.96875C8.72713 7.98438 8.53125 8.18025 8.53125 8.42188C8.53125 8.6635 8.72713 8.85938 8.96875 8.85938H10.1Z"
								fill="white"
							/>
						</svg>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Tooltip;
