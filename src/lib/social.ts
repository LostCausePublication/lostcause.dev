export const AUTHOR_SOCIAL_PLATFORMS = [
	{ key: 'website', label: 'Website' },
	{ key: 'github', label: 'GitHub' },
	{ key: 'twitter', label: 'X' },
	{ key: 'substack', label: 'Substack' },
	{ key: 'threads', label: 'Threads' },
	{ key: 'bluesky', label: 'Bluesky' },
	{ key: 'youtube', label: 'YouTube' },
	{ key: 'facebook', label: 'Facebook' },
	{ key: 'instagram', label: 'Instagram' },
	{ key: 'tiktok', label: 'TikTok' },
	{ key: 'twitch', label: 'Twitch' },
	{ key: 'reddit', label: 'Reddit' },
	{ key: 'linkedin', label: 'LinkedIn' },
] as const;

export type SocialPlatformKey = (typeof AUTHOR_SOCIAL_PLATFORMS)[number]['key'];

export type AuthorSocialLinks = Partial<Record<SocialPlatformKey, string>>;

export function getAuthorSocialLinks(
	data: Record<string, unknown>,
): { key: SocialPlatformKey; label: string; url: string; showReferral: boolean }[] {
	return AUTHOR_SOCIAL_PLATFORMS.flatMap((platform) => {
		const url = data[platform.key];
		return typeof url === 'string' && url.length > 0
			? [{ key: platform.key, label: platform.label, url, showReferral: platform.key === 'website' }]
			: [];
	});
}
