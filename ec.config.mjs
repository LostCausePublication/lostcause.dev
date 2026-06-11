import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
	themes: ['github-light'],
	frames: {
		extractFileNameFromCode: false,
		showCopyToClipboardButton: true,
	},
	styleOverrides: {
		borderColor: 'rgba(27, 26, 27, 0.15)',
		borderRadius: '0',
		codeFontFamily: "'Share Tech Mono', monospace",
		uiFontFamily: "'Bricolage Grotesque', sans-serif",
		frames: {
			shadowColor: 'transparent',
			frameBoxShadowCssValue: 'none',
		},
	},
});
