import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		draft: z.boolean().default(false),
		authors: z.array(z.string()).min(1),
		categories: z.array(z.string()).min(1),
		ogImage: z.string().optional(),
		ogImageAlt: z.string().optional(),
		featured: z.boolean().default(false),
	}),
});

const authors = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
	schema: z.object({
		name: z.string(),
		bio: z.string(),
		avatar: z.string().optional(),
		website: z.string().url().optional(),
		github: z.string().url().optional(),
		twitter: z.string().url().optional(),
		substack: z.string().url().optional(),
		threads: z.string().url().optional(),
		bluesky: z.string().url().optional(),
		youtube: z.string().url().optional(),
		facebook: z.string().url().optional(),
		instagram: z.string().url().optional(),
		tiktok: z.string().url().optional(),
		twitch: z.string().url().optional(),
		reddit: z.string().url().optional(),
		linkedin: z.string().url().optional(),
	}),
});

const tools = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
	schema: z.object({
		name: z.string(),
		categories: z.array(z.string()).min(1),
		description: z.string(),
		avatar: z.string(),
		url: z.string().url(),
	}),
});

export const collections = { blog, authors, tools };
