import { components } from '@dtinsight/molecule';
import { useCallback, useEffect, useState } from 'react';
import websitePkg from '../../../package.json';
import pkg from '../../../../package.json';
import { createPortal } from 'react-dom';
import { Container, Dialog, Boxen, Row, Link, Text, ButtonRow } from './styled';

export default function PoweredBy() {
	const [open, setOpen] = useState(false);

	const handleKeyDown = useCallback((e: any) => {
		if (e.key === 'Escape') {
			setOpen(false);
		}
	}, []);

	const handleOpen = () => {
		setOpen(true);
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown, { once: true });
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [open]);

	return (
		<>
			<Container onClick={handleOpen}>
				<components.Icon type="code" />
			</Container>
			{createPortal(
				<Dialog open={open} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
					<Boxen>
						<Row>
							<img src="/molecule-logo.png" width={40} height={40} />
							<Text>
								<Link href="https://github.com/DTStack/molecule" target="_blank">
									Molecule: {websitePkg.dependencies['@dtinsight/molecule']}
								</Link>
								<Link
									href="https://github.com/DTStack/monaco-sql-languages"
									target="_blank"
								>
									monaco-sql-languages: {pkg.version}
								</Link>
								<Link
									href="https://github.com/subframe7536/maple-font"
									target="_blank"
								>
									fonts: Maple Mono
								</Link>
							</Text>
						</Row>
						<ButtonRow>
							<components.Button
								autoFocus
								onClick={() => setOpen(false)}
								size="large"
							>
								确认
							</components.Button>
						</ButtonRow>
					</Boxen>
				</Dialog>,
				document.body
			)}
		</>
	);
}
