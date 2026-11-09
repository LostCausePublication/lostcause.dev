import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { SITE } from '../lib/site';
import {
	loadPublishedPosts,
	renderLlmsTxt,
	renderPostMarkdown,
	type LlmPost,
} from '../lib/llm-markdown';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function llmsTxt(): AstroIntegration {
	return {
		name: 'llms-txt',
		hooks: {
			'astro:server:setup': ({ server }) => {
				server.middlewares.use((req, res, next) => {
					const route = matchMarkdownRoute(req.url);
					if (!route) {
						next();
						return;
					}

					void serveMarkdown(route, res)
						.then((served) => {
							if (!served) next();
						})
						.catch(next);
				});
			},
			'astro:build:done': async ({ dir, logger }) => {
				const posts = await loadPublishedPosts(projectRoot);
				const outDir = fileURLToPath(dir);

				await writeFile(path.join(outDir, 'llms.txt'), renderLlmsTxt(posts));
				for (const post of posts) {
					const destination = path.join(outDir, 'blog', post.slug, 'index.md');
					await mkdir(path.dirname(destination), { recursive: true });
					await writeFile(destination, renderPostMarkdown(post));
				}

				logger.info(`Wrote llms.txt and ${posts.length} blog markdown mirrors`);
			},
		},
	};
}

type MarkdownRoute = { kind: 'index' } | { kind: 'post'; slug: string };

function matchMarkdownRoute(url: string | undefined): MarkdownRoute | null {
	const pathname = url?.split('?')[0] ?? '';
	if (pathname === '/llms.txt') return { kind: 'index' };

	const match = pathname.match(/^\/blog\/([^/]+)\/index\.md$/);
	if (!match) return null;
	return { kind: 'post', slug: decodeURIComponent(match[1]) };
}

async function serveMarkdown(
	route: MarkdownRoute,
	res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void },
): Promise<boolean> {
	const posts = await loadPublishedPosts(projectRoot);

	if (route.kind === 'index') {
		sendMarkdown(res, renderLlmsTxt(posts));
		return true;
	}

	const post = posts.find((entry) => entry.slug === route.slug);
	if (!post) return false;

	sendMarkdown(res, renderPostMarkdown(post), post);
	return true;
}

function sendMarkdown(
	res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void },
	body: string,
	post?: LlmPost,
): void {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
	res.setHeader('X-Robots-Tag', 'noindex');
	if (post) {
		res.setHeader('Link', `<${SITE.url}/blog/${post.slug}/>; rel="canonical"`);
	}
	res.end(body);
}
