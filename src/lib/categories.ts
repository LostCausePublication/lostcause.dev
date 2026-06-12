import type { BlogPost } from './blog';
import { getPublishedPosts } from './blog';

export type CategoryStat = {
	name: string;
	slug: string;
	count: number;
};

export function getCategorySlug(category: string): string {
	return category
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-');
}

export function getPostCategories(post: BlogPost): string[] {
	return post.data.categories;
}

export async function getCategoryStats(): Promise<CategoryStat[]> {
	const posts = await getPublishedPosts();
	const map = new Map<string, CategoryStat>();

	for (const post of posts) {
		for (const category of post.data.categories) {
			const slug = getCategorySlug(category);
			const existing = map.get(slug);

			if (existing) {
				existing.count++;
			} else {
				map.set(slug, { name: category, slug, count: 1 });
			}
		}
	}

	return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
	const posts = await getPublishedPosts();
	return posts.filter((post) =>
		post.data.categories.some((category) => getCategorySlug(category) === categorySlug),
	);
}

export async function getCategoryBySlug(categorySlug: string): Promise<CategoryStat | undefined> {
	const categories = await getCategoryStats();
	return categories.find((category) => category.slug === categorySlug);
}
