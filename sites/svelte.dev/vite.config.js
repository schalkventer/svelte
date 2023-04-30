import { sveltekit } from '@sveltejs/kit/vite';
import * as fs from 'fs';
import { imagetools } from 'vite-imagetools';

process.env.VITE_API_BASE = process.env.DOCS_PREVIEW
	? 'http://localhost:8787'
	: 'https://api.svelte.dev';

function raw(ext) {
	return {
		name: 'vite-plugin-raw',
		transform(_, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return { code: `export default ${JSON.stringify(buffer)}`, map: null };
			}
		}
	};
}

/** @type {import('vite').UserConfig} */
const config = {
	logLevel: 'info',
	plugins: [raw(['.ttf']), imagetools(), sveltekit()],
	optimizeDeps: {
		include: ['@codemirror/view', '@codemirror/state'],
		exclude: ['@sveltejs/site-kit', '@sveltejs/repl', '@puruvj/svelte-repl-next']
	},
	ssr: { noExternal: ['@sveltejs/site-kit'] },
	server: {
		fs: {
			strict: false
		}
	}
};

export default config;