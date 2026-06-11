import { getCollection, type CollectionEntry } from 'astro:content';

export type Author = CollectionEntry<'authors'>;

export async function getAllAuthors(): Promise<Author[]> {
	const authors = await getCollection('authors');
	return authors.sort((a, b) => a.data.name.localeCompare(b.data.name));
}

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
	const authors = await getCollection('authors');
	return authors.find((author) => getAuthorSlug(author) === slug);
}

export async function getAuthorsBySlugs(slugs: string[]): Promise<Author[]> {
	const authors = await getCollection('authors');
	const authorMap = new Map(authors.map((author) => [getAuthorSlug(author), author]));

	return slugs
		.map((slug) => authorMap.get(slug))
		.filter((author): author is Author => author !== undefined);
}

export function getAuthorSlug(author: Author): string {
	return author.id.replace(/\.(md|mdx)$/, '');
}
