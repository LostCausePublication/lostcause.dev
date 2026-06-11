import type { ImageMetadata } from 'astro';

const avatars = import.meta.glob<{ default: ImageMetadata }>('../assets/*.{jpg,jpeg,png,webp}', {
	eager: true,
});

export function getAuthorAvatar(filename: string): ImageMetadata | null {
	const key = `../assets/${filename}`;
	return avatars[key]?.default ?? null;
}
