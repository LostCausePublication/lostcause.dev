import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
	themes: ['github-light', 'github-dark'],
	themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
	frames: {
		extractFileNameFromCode: false,
		showCopyToClipboardButton: true,
	},
	styleOverrides: {
		borderColor: 'var(--color-border)',
		borderRadius: '0',
		codeFontFamily: 'var(--font-share-tech-mono), monospace',
		uiFontFamily: 'var(--font-bricolage), sans-serif',
		frames: {
			shadowColor: 'transparent',
			frameBoxShadowCssValue: 'none',
		},
	},
});
