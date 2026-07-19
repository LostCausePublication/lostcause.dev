export const SITE = {
	name: 'Lost Cause Publication',
	tagline: 'AI does it faster, but this is more fun',
	description:
		'A not-so-serious coding publication about JavaScript/TypeScript ecosystem, open-source projects and CLI tools.',
	keywords: [
		'JavaScript',
		'TypeScript',
		'JavaScript ecosystem',
		'TypeScript ecosystem',
		'open-source projects',
		'open source',
		'CLI tools',
		'developer tools',
		'web development',
		'programming',
		'coding publication',
	],
	url: 'https://lostcause.dev',
	themeColor: '#f9f7f2',
	githubUrl: 'https://github.com/LostCausePublication',
	twitterUrl: 'https://x.com/lostcausedotdev',
} as const;

export const TAGLINES = [
	'AI does it faster, but this is more fun',
	'Building things nobody asked for',
	'Code for no good reason',
	'Learning to code, apparently',
	'AI writes code. We pretend to understand it',
] as const;

export const NAV_LINKS = [
	{ href: '/', label: 'Home' },
	{ href: '/blog/', label: 'Blog' },
	{ href: '/authors/', label: 'Authors' },
	{ href: '/tools/', label: 'Tools' },
] as const;

export const SOCIAL_LINKS = [
	{ label: 'GitHub', href: SITE.githubUrl, platform: 'github' as const },
	{ label: 'X', href: SITE.twitterUrl, platform: 'twitter' as const },
] as const;

export const LUNAFINDER = {
	name: 'LunaFinder',
	url: 'https://lunafinder.com?ref=lostcasedev',
} as const;
