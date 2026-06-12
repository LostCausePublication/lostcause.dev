// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';
import { remarkCodeFrameNone } from './src/integrations/remark-code-frame-none.ts';
import { remarkBlogImages } from './src/integrations/remark-blog-images.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://lostcause.dev',
	integrations: [expressiveCode(), mdx()],
	markdown: {
		processor: unified({
			remarkPlugins: [remarkBlogImages, remarkCodeFrameNone],
		}),
	},
});
