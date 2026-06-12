import { existsSync } from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';

const ASSETS_ROOT = path.resolve('src/assets');

/**
 * Lets posts reference images that live in `src/assets/blog/[post-slug]/` using
 * short, forgiving paths, and rewrites them to a path relative to the content
 * file so Astro's native image pipeline optimizes, hashes, and emits them.
 *
 * Supported references (all point at the same file):
 *   ![alt](test.png)                                  // bare, post-relative
 *   ![alt](./test.png)
 *   ![alt](/src/assets/blog/<slug>/test.png)          // project-absolute source
 *   ![alt](assets/blog/<slug>/test.png)
 *
 * Already content-relative (`../`), remote, and data: URLs are left untouched.
 */
export function remarkBlogImages() {
	return (tree, file) => {
		const filePath = file.path;
		if (!filePath) return;

		const slug = path.basename(filePath, path.extname(filePath));
		const fileDir = path.dirname(filePath);

		visit(tree, 'image', (node) => {
			const url = node.url;
			if (typeof url !== 'string' || url === '') return;
			if (/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('../')) return;

			const assetsMatch = url.match(/^\/?(?:src\/)?assets\/(.+)$/);
			const subpath = assetsMatch ? assetsMatch[1] : `blog/${slug}/${url}`;
			const absolute = path.join(ASSETS_ROOT, subpath);

			if (!existsSync(absolute)) return;

			let relative = path.relative(fileDir, absolute);
			if (!relative.startsWith('.')) relative = `./${relative}`;
			node.url = relative;
		});
	};
}
