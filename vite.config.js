import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { chromeExtension } from 'vite-plugin-chrome-extension';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			$: resolve('./src'),
			$libs: resolve('./src/libs'),
		},
	},
	build: {
		rollupOptions: {
			input: './src/manifest.json',
		},
		outDir: 'build',
		minify: 'esbuild',
	},
	plugins: [chromeExtension()],
});
