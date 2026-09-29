import { glossaryTerms, type GlossaryCategoryId, type GlossaryTerm } from '../data/glossary';
import { getCanonicalUrl } from './seo';

export type { GlossaryCategoryId, GlossaryTerm };

export const GLOSSARY_INDEX_PATH = '/glossary/';

export const GLOSSARY_INDEX_DESCRIPTION =
	'Plain-language definitions of common tech terms, from APIs and Git to LLMs and SaaS.';

const GLOSSARY_CATEGORIES: { id: GlossaryCategoryId; label: string }[] = [
	{ id: 'web-development', label: 'Web Development' },
	{ id: 'version-control', label: 'Version Control' },
	{ id: 'devops', label: 'DevOps' },
	{ id: 'software-architecture', label: 'Software Architecture' },
	{ id: 'database', label: 'Database' },
	{ id: 'software-engineering', label: 'Software Engineering' },
	{ id: 'frontend', label: 'Frontend' },
	{ id: 'backend', label: 'Backend' },
	{ id: 'security', label: 'Security' },
	{ id: 'content-creation', label: 'Content Creation' },
	{ id: 'platforms', label: 'Platforms' },
	{ id: 'internet', label: 'Internet' },
	{ id: 'startup', label: 'Startup' },
	{ id: 'ai', label: 'AI' },
	{ id: 'sales', label: 'Sales' },
	{ id: 'marketing', label: 'Marketing' },
	{ id: 'events', label: 'Events' },
];

export type GlossaryCategoryStat = {
	id: GlossaryCategoryId;
	label: string;
	count: number;
};

export function glossaryTermPath(id: string): string {
	return `/glossary/${id}/`;
}

export function glossaryCategoryPath(id: string): string {
	return `/glossary/category/${id}/`;
}

export function getGlossaryTerms(): GlossaryTerm[] {
	return [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
}

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
	return glossaryTerms.find((term) => term.id === id);
}

export function getCategoryLabel(id: GlossaryCategoryId): string {
	return GLOSSARY_CATEGORIES.find((category) => category.id === id)?.label ?? id;
}

export function getUsedCategories(): GlossaryCategoryStat[] {
	return GLOSSARY_CATEGORIES.map((category) => ({
		...category,
		count: glossaryTerms.filter((term) => term.categories.includes(category.id)).length,
	}))
		.filter((category) => category.count > 0)
		.sort((a, b) => a.label.localeCompare(b.label, 'en'));
}

export function getTermsByCategory(id: GlossaryCategoryId): GlossaryTerm[] {
	return getGlossaryTerms().filter((term) => term.categories.includes(id));
}

export function metaDescription(text: string, max = 160): string {
	const normalized = text.replace(/\s+/g, ' ').trim();
	if (normalized.length <= max) {
		return normalized;
	}

	const sliced = normalized.slice(0, max - 1);
	const boundary = sliced.lastIndexOf(' ');
	const cut = boundary > 80 ? sliced.slice(0, boundary) : sliced;
	return `${cut.trimEnd()}…`;
}

export function relatedLinkLabel(url: string, urls: string[]): string {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return url;
	}

	const host = parsed.hostname.replace(/^www\./, '');
	const sameHost = urls.filter((item) => {
		try {
			return new URL(item).hostname.replace(/^www\./, '') === host;
		} catch {
			return false;
		}
	});

	if (sameHost.length < 2) {
		return host;
	}

	const path = parsed.pathname.replace(/\/$/, '');
	return path && path !== '/' ? `${host}${path}` : host;
}

export function glossarySearchText(term: GlossaryTerm): string {
	return `${term.term} ${term.explanation}`.toLowerCase();
}

export function categoryDescription(label: string): string {
	return `Plain-language definitions of ${label} terms.`;
}

export function glossaryIndexJsonLd(terms: GlossaryTerm[]): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'DefinedTermSet',
		name: 'Lost Cause Glossary',
		description: GLOSSARY_INDEX_DESCRIPTION,
		url: getCanonicalUrl(GLOSSARY_INDEX_PATH),
		hasDefinedTerm: terms.map((term) => ({
			'@type': 'DefinedTerm',
			name: term.term,
			description: term.explanation,
			url: getCanonicalUrl(glossaryTermPath(term.id)),
		})),
	};
}

export function glossaryTermJsonLd(term: GlossaryTerm): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'DefinedTerm',
		name: term.term,
		description: term.explanation,
		url: getCanonicalUrl(glossaryTermPath(term.id)),
		inDefinedTermSet: getCanonicalUrl(GLOSSARY_INDEX_PATH),
	};
}

export function glossaryCategoryJsonLd(category: GlossaryCategoryStat, terms: GlossaryTerm[]): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: `${category.label} glossary`,
		description: categoryDescription(category.label),
		url: getCanonicalUrl(glossaryCategoryPath(category.id)),
		isPartOf: getCanonicalUrl(GLOSSARY_INDEX_PATH),
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: terms.map((term, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: term.term,
				url: getCanonicalUrl(glossaryTermPath(term.id)),
			})),
		},
	};
}
