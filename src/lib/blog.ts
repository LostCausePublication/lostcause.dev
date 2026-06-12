import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getPublishedPosts(): Promise<BlogPost[]> {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getPostsByAuthor(authorSlug: string): Promise<BlogPost[]> {
	const posts = await getPublishedPosts();
	return posts.filter((post) => post.data.authors.includes(authorSlug));
}

export async function getAuthorPostCounts(): Promise<Map<string, number>> {
	const posts = await getPublishedPosts();
	const counts = new Map<string, number>();

	for (const post of posts) {
		for (const authorSlug of post.data.authors) {
			counts.set(authorSlug, (counts.get(authorSlug) ?? 0) + 1);
		}
	}

	return counts;
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export function getPostSlug(post: BlogPost): string {
	return post.id.replace(/\.(md|mdx)$/, '');
}
