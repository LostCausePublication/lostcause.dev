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
	noIndex?: boolean;
};

export function getCanonicalUrl(pathname: string): string {
	return new URL(pathname, SITE.url).href;
}

export function getPageTitle(title: string): string {
	return title === SITE.name ? `${SITE.name} | ${SITE.tagline}` : `${title} | ${SITE.name}`;
}

export { getDefaultOgImageUrl } from './og-images';
