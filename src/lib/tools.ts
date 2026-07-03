import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Tool = CollectionEntry<'tools'>;

/**
 * Tool logos live in `src/assets/tools/` and are referenced from frontmatter,
 * e.g. `avatar: assets/tools/instavisuals.png`. They go through Astro's asset
 * pipeline so they are hashed, optimized, and emitted to `_astro/`.
 */
const toolAvatars = import.meta.glob<{ default: ImageMetadata }>(
	'../assets/tools/*.{png,jpg,jpeg,webp}',
	{ eager: true },
);

const categoryIcons = import.meta.glob<{ default: ImageMetadata }>(
	'../assets/tools/categories/*.svg',
	{ eager: true },
);

/** Resolve a frontmatter `avatar` path to an optimized asset from `src/assets`. */
export function resolveToolAvatar(avatarPath: string): ImageMetadata | null {
	const normalized = avatarPath.replace(/^\//, '').replace(/^(?:src\/)?assets\//, '');
	const key = `../assets/${normalized}`;

	return toolAvatars[key]?.default ?? null;
}

/** Resolve a category icon path from `src/assets/tools/categories/`. */
export function resolveCategoryIcon(iconPath: string): ImageMetadata | null {
	const normalized = iconPath.replace(/^\//, '').replace(/^(?:src\/)?assets\//, '');
	const key = `../assets/${normalized}`;

	return categoryIcons[key]?.default ?? null;
}

export async function getAllTools(): Promise<Tool[]> {
	const tools = await getCollection('tools');
	return tools.sort((a, b) => a.data.name.localeCompare(b.data.name));
}

export function groupToolsByCategory(tools: Tool[]): Map<string, Tool[]> {
	const grouped = new Map<string, Tool[]>();

	for (const tool of tools) {
		for (const categoryId of tool.data.categories) {
			const existing = grouped.get(categoryId) ?? [];
			existing.push(tool);
			grouped.set(categoryId, existing);
		}
	}

	for (const [categoryId, categoryTools] of grouped) {
		grouped.set(
			categoryId,
			categoryTools.sort((a, b) => a.data.name.localeCompare(b.data.name)),
		);
	}

	return grouped;
}
