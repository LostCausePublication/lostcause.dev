import { SITE } from './site';

export type SeoData = {
	title: string;
	description?: string;
	/** Pathname, e.g. `/blog/my-post`. Defaults to the current page path. */
	canonicalPath?: string;
	/** Absolute URL to the Open Graph / Twitter image. */
	image?: string;
	imageAlt?: string;
	type?: 'website' | 'article';
	publishedTime?: Date;
	modifiedTime?: Date;
	authors?: string[];
	categories?: string[];
	/** Overrides the default site-wide keywords. */
	keywords?: string[];
	noIndex?: boolean;
	/** Replaces the default WebSite or BlogPosting JSON-LD graph. */
	jsonLd?: object;
	/** Path to the Markdown mirror, e.g. `/blog/my-post/index.md`. */
	markdownPath?: string;
};

export function getCanonicalUrl(pathname: string): string {
	return new URL(pathname, SITE.url).href;
}

const SITE_TITLE_SUFFIX = ` | ${SITE.name}`;

export function getPageTitle(title: string): string {
	if (title === SITE.name) {
		return `${SITE.name} | Coding Publication`;
	}

	const fullTitle = `${title}${SITE_TITLE_SUFFIX}`;
	if (fullTitle.length <= 60) {
		return fullTitle;
	}

	const maxTitleLength = 60 - SITE_TITLE_SUFFIX.length - 1;
	return `${title.slice(0, maxTitleLength).trimEnd()}…${SITE_TITLE_SUFFIX}`;
}

export type HomeJsonLdPost = {
	title: string;
	description: string;
	path: string;
	datePublished: Date;
	dateModified?: Date;
	authors: string[];
};

export function getHomeJsonLd(posts: HomeJsonLdPost[]): object {
	const websiteId = `${SITE.url}/#website`;
	const organizationId = `${SITE.url}/#organization`;

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': websiteId,
				name: SITE.name,
				description: SITE.description,
				url: SITE.url,
				inLanguage: 'en-US',
				publisher: { '@id': organizationId },
			},
			{
				'@type': 'Organization',
				'@id': organizationId,
				name: SITE.name,
				url: SITE.url,
				logo: {
					'@type': 'ImageObject',
					url: getCanonicalUrl('/android-chrome-512x512.png'),
					width: 512,
					height: 512,
				},
				sameAs: [SITE.githubUrl, SITE.twitterUrl],
			},
			{
				'@type': 'Blog',
				'@id': `${SITE.url}/#blog`,
				name: SITE.name,
				description: SITE.description,
				url: getCanonicalUrl('/blog/'),
				isPartOf: { '@id': websiteId },
				publisher: { '@id': organizationId },
				blogPost: posts.map((post) => ({
					'@type': 'BlogPosting',
					headline: post.title,
					description: post.description,
					url: getCanonicalUrl(post.path),
					datePublished: post.datePublished.toISOString(),
					dateModified: (post.dateModified ?? post.datePublished).toISOString(),
					author: post.authors.map((name) => ({ '@type': 'Person', name })),
				})),
			},
		],
	};
}

export { getDefaultOgImageUrl } from './og-images';
