export type BreadcrumbItem = {
	label: string;
	href?: string;
};

/** Visual and structured trails both start at Home. */
export function breadcrumbTrail(items: BreadcrumbItem[]): BreadcrumbItem[] {
	const [first] = items;
	if (!first || first.href === '/' || first.label === 'Home') return items;
	return [{ label: 'Home', href: '/' }, ...items];
}
