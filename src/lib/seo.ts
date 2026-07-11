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

export { getDefaultOgImageUrl } from './og-images';
