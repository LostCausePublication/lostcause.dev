import { visit } from 'unist-util-visit';

/**
 * Adds `frame=none` to every fenced code block so Expressive Code
 * renders the copy button without editor/terminal window chrome.
 */
export function remarkCodeFrameNone() {
	return (tree) => {
		visit(tree, 'code', (node) => {
			if (node.type !== 'code') return;

			const meta = typeof node.meta === 'string' ? node.meta : '';
			if (/\bframe\s*=/.test(meta)) return;

			node.meta = meta ? `${meta} frame=none` : 'frame=none';
		});
	};
}
