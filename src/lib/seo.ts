import type { BreadcrumbItem } from './breadcrumbs';
import { breadcrumbTrail } from './breadcrumbs';
import { SITE } from './site';

export type SeoAuthor = {
	name: string;
	/** Absolute profile URL. */
	url: string;
};

export type SeoData = {
	title: string;
	description?: string;
	/** Pathname, e.g. `/blog/my-post`. Defaults to the current page path. */
	canonicalPath?: string;
	/** Absolute URL to the Open Graph / Twitter image. */
	image?: string;
	imageAlt?: string;
	imageWidth?: number;
	imageHeight?: number;
	type?: 'website' | 'article';
	publishedTime?: Date;
	modifiedTime?: Date;
	authors?: SeoAuthor[];
	categories?: string[];
	/** Overrides the default site-wide keywords. */
	keywords?: string[];
	noIndex?: boolean;
	/** Replaces the default WebPage or BlogPosting JSON-LD graph. */
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

	return `${title}${SITE_TITLE_SUFFIX}`;
}

/** Drop emoji so a bio can be used as a meta description. */
export function stripEmoji(text: string): string {
	return text
		.replace(/\p{Extended_Pictographic}|\p{Emoji_Modifier}|\uFE0F|\u200D/gu, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Search snippet for an author profile. The visible bio is left unchanged. */
export function authorMetaDescription(name: string, bio: string): string {
	const plainBio = stripEmoji(bio);
	return plainBio ? `Posts by ${name} on ${SITE.name}. ${plainBio}` : `Posts by ${name} on ${SITE.name}.`;
}

const websiteId = `${SITE.url}/#website`;
const organizationId = `${SITE.url}/#organization`;

function websiteNode(): object {
	return {
		'@type': 'WebSite',
		'@id': websiteId,
		name: SITE.name,
		description: SITE.description,
		url: SITE.url,
		inLanguage: 'en-US',
		publisher: { '@id': organizationId },
	};
}

function organizationNode(): object {
	return {
		'@type': 'Organization',
		'@id': organizationId,
		name: SITE.name,
		url: SITE.url,
		logo: publisherLogo(),
		sameAs: [SITE.githubUrl, SITE.twitterUrl],
	};
}

function publisherLogo(): object {
	return {
		'@type': 'ImageObject',
		url: getCanonicalUrl('/android-chrome-512x512.png'),
		width: 512,
		height: 512,
	};
}

function graph(...nodes: object[]): object {
	return {
		'@context': 'https://schema.org',
		'@graph': [websiteNode(), organizationNode(), ...nodes],
	};
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
	return graph({
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
	});
}

export function webPageJsonLd(input: { name: string; description: string; url: string }): object {
	return graph({
		'@type': 'WebPage',
		'@id': input.url,
		name: input.name,
		description: input.description,
		url: input.url,
		isPartOf: { '@id': websiteId },
		inLanguage: 'en-US',
	});
}

export type SchemaListItem = {
	name: string;
	url: string;
	description?: string;
};

export function collectionPageJsonLd(input: {
	name: string;
	description: string;
	url: string;
	items: SchemaListItem[];
}): object {
	return graph({
		'@type': 'CollectionPage',
		'@id': input.url,
		name: input.name,
		description: input.description,
		url: input.url,
		isPartOf: { '@id': websiteId },
		inLanguage: 'en-US',
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: input.items.map((item, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: item.name,
				url: item.url,
				...(item.description ? { description: item.description } : {}),
			})),
		},
	});
}

export function profilePageJsonLd(input: {
	name: string;
	description: string;
	bio: string;
	url: string;
	image?: string;
	sameAs: string[];
}): object {
	return graph({
		'@type': 'ProfilePage',
		'@id': input.url,
		name: input.name,
		description: input.description,
		url: input.url,
		isPartOf: { '@id': websiteId },
		inLanguage: 'en-US',
		mainEntity: {
			'@type': 'Person',
			name: input.name,
			description: input.bio,
			url: input.url,
			...(input.image ? { image: input.image } : {}),
			...(input.sameAs.length > 0 ? { sameAs: input.sameAs } : {}),
		},
	});
}

export function blogPostingJsonLd(input: {
	title: string;
	description: string;
	url: string;
	image: string;
	imageWidth: number;
	imageHeight: number;
	publishedTime?: Date;
	modifiedTime?: Date;
	authors: SeoAuthor[];
	categories: string[];
}): object {
	const modified = input.modifiedTime ?? input.publishedTime;

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: input.title,
		description: input.description,
		url: input.url,
		inLanguage: 'en-US',
		image: {
			'@type': 'ImageObject',
			url: input.image,
			width: input.imageWidth,
			height: input.imageHeight,
		},
		datePublished: input.publishedTime?.toISOString(),
		dateModified: modified?.toISOString(),
		author: input.authors.map((author) => ({
			'@type': 'Person',
			name: author.name,
			url: author.url,
		})),
		publisher: {
			'@type': 'Organization',
			name: SITE.name,
			url: SITE.url,
			logo: publisherLogo(),
		},
		mainEntityOfPage: input.url,
		articleSection: input.categories,
		keywords: input.categories.join(', '),
	};
}

export function breadcrumbListJsonLd(items: BreadcrumbItem[], pageUrl: string): object {
	const trail = breadcrumbTrail(items);

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: trail.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.label,
			item: index === trail.length - 1 || !item.href ? pageUrl : getCanonicalUrl(item.href),
		})),
	};
}

export { getDefaultOgImageUrl } from './og-images';
