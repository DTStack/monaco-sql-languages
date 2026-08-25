import type { RunStatementButtonThemeColors, RunStatementButtonThemePalette } from './types';

const STYLE_ELEMENT_ID_PREFIX = 'monaco-sql-languages-run-statement-button-styles';

export const DEFAULT_RUN_GLYPH_CLASS_NAME = 'mssql-run-statement-glyph';

/** Default palette aligned with VS Code run/debug accent colors. */
export const DEFAULT_RUN_BUTTON_THEME_PALETTE: Record<
	'dark' | 'light' | 'hc',
	RunStatementButtonThemeColors
> = {
	dark: { normal: '#73c991', hover: '#89d19d' },
	light: { normal: '#16825d', hover: '#107c10' },
	hc: { normal: '#1aebff', hover: '#4df2ff' }
};

function getStyleElementId(className: string): string {
	return `${STYLE_ELEMENT_ID_PREFIX}-${className.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

function buildTriangleRules(
	className: string,
	selector: string,
	colors: RunStatementButtonThemeColors
): string {
	return `
${selector} .${className}::before {
	border-left-color: ${colors.normal};
}
${selector} .${className}:hover::before {
	border-left-color: ${colors.hover};
}
`;
}

function getStyleContent(
	className: string,
	palette: Record<'dark' | 'light' | 'hc', RunStatementButtonThemeColors>
): string {
	return `
.monaco-editor .${className} {
	cursor: pointer;
	position: relative;
	opacity: 1 !important;
	background: none !important;
	background-image: none !important;
}
.monaco-editor .${className}::before {
	content: '';
	position: absolute;
	left: 50%;
	top: 50%;
	margin-left: -3px;
	transform: translate(-50%, -50%);
	border-style: solid;
	border-width: 5px 0 5px 9px;
	border-color: transparent;
	pointer-events: none;
	transition: border-color 0.15s ease;
}
${buildTriangleRules(className, '.monaco-editor.vs-dark', palette.dark)}
${buildTriangleRules(className, '.monaco-editor.hc-black', palette.hc)}
${buildTriangleRules(className, '.monaco-editor.vs', palette.light)}
${buildTriangleRules(className, '.monaco-editor.hc-light', palette.hc)}
`;
}

export function injectRunStatementButtonStyles(
	className = DEFAULT_RUN_GLYPH_CLASS_NAME,
	palette?: RunStatementButtonThemePalette
): void {
	if (typeof document === 'undefined') {
		return;
	}

	const resolvedPalette = {
		dark: palette?.dark ?? DEFAULT_RUN_BUTTON_THEME_PALETTE.dark,
		light: palette?.light ?? DEFAULT_RUN_BUTTON_THEME_PALETTE.light,
		hc: palette?.hc ?? DEFAULT_RUN_BUTTON_THEME_PALETTE.hc
	};

	const styleElementId = getStyleElementId(className);
	const styleContent = getStyleContent(className, resolvedPalette);
	const existing = document.getElementById(styleElementId);
	if (existing) {
		existing.textContent = styleContent;
		return;
	}

	const style = document.createElement('style');
	style.id = styleElementId;
	style.textContent = styleContent;
	document.head.appendChild(style);
}
