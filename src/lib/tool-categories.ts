export type ToolSubcategory = {
	id: string;
	label: string;
	description: string;
	icon: string;
};

export type ToolCategoryGroup = {
	id: string;
	label: string;
	icon: string;
	subcategories: ToolSubcategory[];
};

export const TOOL_CATEGORY_GROUPS: ToolCategoryGroup[] = [
	{
		id: 'media',
		label: 'Media',
		icon: 'assets/tools/categories/media.svg',
		subcategories: [
			{
				id: 'images',
				label: 'Images',
				description: 'Photo editing, resizing, and library management tools.',
				icon: 'assets/tools/categories/images.svg',
			},
			{
				id: 'video',
				label: 'Video',
				description: 'Animation, conversion, and video creation tools.',
				icon: 'assets/tools/categories/video.svg',
			},
			{
				id: 'webcam',
				label: 'Webcam',
				description: 'Test and preview your camera before video calls.',
				icon: 'assets/tools/categories/webcam.svg',
			},
		],
	},
	{
		id: 'productivity',
		label: 'Productivity',
		icon: 'assets/tools/categories/productivity.svg',
		subcategories: [
			{
				id: 'writing',
				label: 'Writing',
				description: 'Drafting, editing, and revision tools for written content.',
				icon: 'assets/tools/categories/writing.svg',
			},
		],
	},
];

export function getAllSubcategories(): ToolSubcategory[] {
	return TOOL_CATEGORY_GROUPS.flatMap((group) => group.subcategories);
}

export function getSubcategoryById(id: string): ToolSubcategory | undefined {
	return getAllSubcategories().find((subcategory) => subcategory.id === id);
}

export function getSubcategoryLabel(id: string): string {
	return getSubcategoryById(id)?.label ?? id;
}
