export const SITE = {
	name: 'Lost Cause Publication',
	tagline: 'AI does it faster, but this is more fun',
	description:
		'A not-so-serious coding publication about open source, CLI tools, programming languages, and fun projects.',
	url: 'https://lostcause.dev',
	themeColor: '#f9f7f2',
	githubUrl: 'https://github.com/LostCausePublication',
	twitterUrl: 'https://x.com/lostcause_dev',
} as const;

export const NAV_LINKS = [
	{ href: '/', label: 'Home' },
	{ href: '/blog', label: 'Blog' },
	{ href: '/authors', label: 'Authors' },
] as const;

export const SOCIAL_LINKS = [
	{ label: 'GitHub', href: SITE.githubUrl, platform: 'github' as const },
	{ label: 'X', href: SITE.twitterUrl, platform: 'twitter' as const },
] as const;

export const LUNAFINDER = {
	name: 'LunaFinder',
	url: 'https://lunafinder.com?ref=lostcasedev',
} as const;
