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
	'../assets/blog/**/*.{png,jpg,jpeg,webp,avif}',
	{ eager: true },
);

/** Resolve a frontmatter `ogImage` path to an imported asset, or fall back. */
function resolveOgImage(ogImagePath?: string): ImageMetadata {
	if (!ogImagePath) return defaultOgImage;

	const normalized = ogImagePath.replace(/^\//, '').replace(/^assets\//, '');
	const key = `../assets/${normalized}`;

	return blogOgImages[key]?.default ?? defaultOgImage;
}

/** Turn an emitted asset path into an absolute URL for social meta tags. */
function toAbsoluteOgUrl(image: ImageMetadata): string {
	return new URL(image.src, SITE.url).href;
}

/** Default OG image used by every page that does not provide its own. */
export function getDefaultOgImageUrl(): string {
	return toAbsoluteOgUrl(defaultOgImage);
}

/** Blog posts: use the `ogImage` frontmatter when set, otherwise the default. */
export function getPostOgImageUrl(ogImagePath?: string): string {
	return toAbsoluteOgUrl(resolveOgImage(ogImagePath));
}
