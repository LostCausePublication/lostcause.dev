import type { ImageMetadata } from 'astro';
import defaultOgImage from '../assets/ogimage.png';
import { SITE } from './site';

/**
 * Blog OG images live in `src/assets/blog/[post-slug]/` and are referenced from
 * frontmatter, e.g. `ogImage: assets/blog/my-post/ogimage.png`. They go through
 * Astro's asset pipeline so they are hashed and emitted to `_astro/`, and we keep
 * their original format (PNG/JPEG) since some social scrapers do not render WebP.
 */
const blogOgImages = import.meta.glob<{ default: ImageMetadata }>(
	'../content/blog/**/*.{png,jpg,jpeg,webp,avif}',
	{ eager: true },
);

/** Resolve a frontmatter `ogImage` path to an imported asset, or fall back. */
function resolveOgImage(ogImagePath?: string): ImageMetadata {
	if (!ogImagePath) return defaultOgImage;

	const normalized = ogImagePath.replace(/^\//, '').replace(/^src\//, '../');

	return blogOgImages[normalized]?.default ?? defaultOgImage;
}

export type OgImage = {
	url: string;
	width: number;
	height: number;
};

/** Turn an emitted asset into an absolute URL plus its intrinsic size. */
function toOgImage(image: ImageMetadata): OgImage {
	return {
		url: new URL(image.src, SITE.url).href,
		width: image.width,
		height: image.height,
	};
}

/** Default OG image used by every page that does not provide its own. */
export function getDefaultOgImage(): OgImage {
	return toOgImage(defaultOgImage);
}

/** Blog posts: use the `ogImage` frontmatter when set, otherwise the default. */
export function getPostOgImage(ogImagePath?: string): OgImage {
	return toOgImage(resolveOgImage(ogImagePath));
}

/** Default OG image used by every page that does not provide its own. */
export function getDefaultOgImageUrl(): string {
	return getDefaultOgImage().url;
}

/** Blog posts: use the `ogImage` frontmatter when set, otherwise the default. */
export function getPostOgImageUrl(ogImagePath?: string): string {
	return getPostOgImage(ogImagePath).url;
}
