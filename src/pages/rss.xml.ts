import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAuthorsBySlugs } from '../lib/authors';
import { getPostSlug, getPublishedPosts } from '../lib/blog';
import { SITE } from '../lib/site';

const cdata = (value: string) => `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;

export async function GET(context: APIContext) {
	const posts = await getPublishedPosts();

	const items = await Promise.all(
		posts.map(async (post) => {
			const authors = await getAuthorsBySlugs(post.data.authors);

			return {
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: `/blog/${getPostSlug(post)}/`,
				categories: post.data.categories,
				customData: authors.map((author) => `<dc:creator>${cdata(author.data.name)}</dc:creator>`).join(''),
			};
		}),
	);

	return rss({
		title: SITE.name,
		description: SITE.description,
		site: context.site ?? SITE.url,
		xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
		customData: '<language>en-us</language>',
		items,
	});
}
