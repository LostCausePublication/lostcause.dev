// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import { remarkCodeFrameNone } from './src/integrations/remark-code-frame-none.ts';
import { remarkBlogImages } from './src/integrations/remark-blog-images.ts';
import { llmsTxt } from './src/integrations/llms-txt.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://lostcause.dev',
	integrations: [expressiveCode(), mdx(), sitemap(), llmsTxt()],
	build: {
		inlineStylesheets: 'always',
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Bricolage Grotesque',
			cssVariable: '--font-bricolage',
			weights: ['500 800'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['sans-serif'],
			options: {
				variableAxis: { opsz: [['12', '96']] },
			},
		},
		{
			provider: fontProviders.google(),
			name: 'Share Tech Mono',
			cssVariable: '--font-share-tech-mono',
			weights: [400],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['monospace'],
		},
	],
	markdown: {
		processor: unified({
			remarkPlugins: [remarkBlogImages, remarkCodeFrameNone],
		}),
	},
});
