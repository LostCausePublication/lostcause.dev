// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import { remarkCodeFrameNone } from './src/integrations/remark-code-frame-none.ts';
import { remarkBlogImages } from './src/integrations/remark-blog-images.ts';
import { llmsTxt } from './src/integrations/llms-txt.ts';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @returns {Map<string, Date>} */
function loadPostLastmods() {
	const blogDir = path.join(projectRoot, 'src/content/blog');
	/** @type {Map<string, Date>} */
	const dates = new Map();

	for (const entry of readdirSync(blogDir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;

		let raw = '';
		for (const filename of ['index.md', 'index.mdx']) {
			try {
				raw = readFileSync(path.join(blogDir, entry.name, filename), 'utf8');
				break;
			} catch {
				// This post uses the other extension.
			}
		}

		if (!raw || /^draft:\s*true\s*$/m.test(raw)) continue;

		const updated = raw.match(/^updatedDate:\s*['"]?([^'"\n]+)['"]?\s*$/m);
		const published = raw.match(/^pubDate:\s*['"]?([^'"\n]+)['"]?\s*$/m);
		const value = (updated ?? published)?.[1]?.trim();
		if (!value) continue;

		const date = new Date(value);
		if (!Number.isNaN(date.valueOf())) dates.set(entry.name, date);
	}

	return dates;
}

const postLastmods = loadPostLastmods();

// https://astro.build/config
export default defineConfig({
	site: 'https://lostcause.dev',
	integrations: [
		expressiveCode(),
		mdx(),
		sitemap({
			serialize(item) {
				const slug = item.url.match(/\/blog\/([^/]+)\/$/)?.[1];
				const lastmod = slug ? postLastmods.get(slug) : undefined;
				return lastmod ? { ...item, lastmod } : item;
			},
		}),
		llmsTxt(),
	],
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
