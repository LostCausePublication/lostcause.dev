import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { SITE } from './site';

export type LlmPost = {
	slug: string;
	title: string;
	description: string;
	pubDate: string;
	updatedDate?: string;
	categories: string[];
	body: string;
};

type Frontmatter = Record<string, string | string[]>;

export function blogDir(projectRoot: string): string {
	return path.join(projectRoot, 'src/content/blog');
}

export async function loadPublishedPosts(projectRoot: string): Promise<LlmPost[]> {
	const dir = blogDir(projectRoot);
	const entries = await readdir(dir, { withFileTypes: true });
	const posts: LlmPost[] = [];

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		const slug = entry.name;
		const raw = await readPostSource(path.join(dir, slug));
		if (raw === null) continue;

		const post = parsePost(raw, slug);
		if (post.draft) continue;
		posts.push(post);
	}

	posts.sort((a, b) => b.pubDate.localeCompare(a.pubDate) || a.slug.localeCompare(b.slug));
	return posts;
}

export function renderLlmsTxt(posts: LlmPost[]): string {
	const lines = [`# ${SITE.name}`, '', `> ${SITE.description}`, '', '## Blog', ''];

	for (const post of posts) {
		const url = `${SITE.url}/blog/${post.slug}/index.md`;
		const title = escapeLinkText(post.title);
		const description = post.description.replace(/\s+/g, ' ').trim();
		lines.push(`- [${title}](${url}): ${description}`);
	}

	return `${lines.join('\n')}\n`;
}

export function renderPostMarkdown(post: LlmPost): string {
	const lines = [`# ${post.title}`, '', `> ${post.description}`, '', `- Published: ${post.pubDate}`];

	if (post.updatedDate) lines.push(`- Updated: ${post.updatedDate}`);
	lines.push(`- Categories: ${post.categories.join(', ')}`);
	lines.push(`- Canonical: ${SITE.url}/blog/${post.slug}/`);
	lines.push('', post.body.trim(), '');

	return lines.join('\n');
}

async function readPostSource(dir: string): Promise<string | null> {
	for (const name of ['index.md', 'index.mdx']) {
		try {
			return await readFile(path.join(dir, name), 'utf8');
		} catch (error) {
			if (!isNotFound(error)) throw error;
		}
	}

	return null;
}

function parsePost(raw: string, slug: string): LlmPost & { draft: boolean } {
	const { data, body } = parseFrontmatter(raw, slug);
	const draftValue = scalar(data, 'draft');

	return {
		slug,
		title: requiredScalar(data, 'title', slug),
		description: requiredScalar(data, 'description', slug),
		pubDate: requiredScalar(data, 'pubDate', slug),
		updatedDate: scalar(data, 'updatedDate'),
		categories: list(data, 'categories', slug),
		body,
		draft: draftValue === 'true',
	};
}

function parseFrontmatter(raw: string, slug: string): { data: Frontmatter; body: string } {
	const normalized = raw.replace(/^\uFEFF/, '');
	const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) {
		throw new Error(`Blog post "${slug}" is missing frontmatter`);
	}

	const data: Frontmatter = {};
	let listKey: string | null = null;

	for (const line of match[1].split(/\r?\n/)) {
		if (!line.trim() || line.trim().startsWith('#')) continue;

		const item = line.match(/^\s+-\s+(.*)$/);
		if (item) {
			if (!listKey || !Array.isArray(data[listKey])) {
				throw new Error(`Blog post "${slug}" has a list item without a key: ${line}`);
			}
			data[listKey].push(stripQuotes(item[1].trim()));
			continue;
		}

		const field = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
		if (!field) {
			throw new Error(`Blog post "${slug}" has an unreadable frontmatter line: ${line}`);
		}

		listKey = field[1];
		const value = field[2].trim();
		data[listKey] = value === '' ? [] : stripQuotes(value);
	}

	return { data, body: normalized.slice(match[0].length) };
}

function requiredScalar(data: Frontmatter, key: string, slug: string): string {
	const value = scalar(data, key);
	if (!value) throw new Error(`Blog post "${slug}" is missing ${key}`);
	return value;
}

function scalar(data: Frontmatter, key: string): string | undefined {
	const value = data[key];
	return typeof value === 'string' && value !== '' ? value : undefined;
}

function list(data: Frontmatter, key: string, slug: string): string[] {
	const value = data[key];
	const items = Array.isArray(value) ? value : typeof value === 'string' && value ? [value] : [];
	if (items.length === 0) throw new Error(`Blog post "${slug}" is missing ${key}`);
	return items;
}

function stripQuotes(value: string): string {
	if (
		(value.startsWith('"') && value.endsWith('"')) ||
		(value.startsWith("'") && value.endsWith("'"))
	) {
		return value.slice(1, -1);
	}
	return value;
}

function escapeLinkText(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
}

function isNotFound(error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code?: string }).code === 'ENOENT'
	);
}
