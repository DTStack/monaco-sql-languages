import React, { useEffect, useRef } from 'react';
import { create } from '@dtinsight/molecule';
import extensions from './extensions';

import './languages';
import './App.css';

const instance = create({
	extensions,
	defaultLocale: 'zh-CN'
});

function App(): React.ReactElement {
	const container = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// FIXME: Molecule Should support font-face
		fetch('icons-carbon.json')
			.then((res) => res.json())
			.then((value) => {
				const style = Array.from(document.querySelectorAll('style')).find((ele) =>
					ele.textContent?.includes('font-family: "codicon"')
				);
				if (!style) return;
				const rules: string[] = [];
				value.fonts.forEach(({ id, src, weight, style }: any) => {
					const fontWeight = weight ? `font-weight: ${weight};` : '';
					const fontStyle = style ? `font-style: ${style};` : '';
					const srcString = src
						.map((item: any) => `url(${item.path}) format('${item.format}')`)
						.join(', ');
					rules.push(
						`@font-face { src: ${srcString}; font-family: ${id};${fontWeight}${fontStyle} font-display: block; }`
					);
					Object.keys(value.iconDefinitions).forEach((key) => {
						rules.push(
							`.codicon-${key}:before { content: '${value.iconDefinitions[key].fontCharacter}' !important; font-family: "${id}"  }`
						);
					});
				});
				style.textContent += rules.join('\n');
			});
	}, []);

	useEffect(() => {
		instance.render(container.current);

		return () => {
			instance.dispose();
		};
	}, []);

	return <div ref={container} />;
}

export default App;
