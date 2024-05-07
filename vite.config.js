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
		minify: 'terser',
		terserOptions: {
			compress: {
				dead_code: true,
				drop_console: true,
				drop_debugger: true,
				passes: Number.MAX_SAFE_INTEGER,
				unused: true,
				booleans: true,
				hoist_funs: true,
				hoist_vars: true,
				keep_fargs: false,
				side_effects: false,
				unsafe: true,
				ecma: 5,
			},
			ecma: 5,
		},
	},
	plugins: [chromeExtension()],
});
