import { svelteTesting } from '@testing-library/svelte/vite';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 40000,
		strictPort: true
	},
	resolve: {
		alias: {
			'@hugmedo/ui': resolve(__dirname, '../../packages/ui')
		}
	},
	// AWS SDK用のグローバルオブジェクトのポリフィル
	define: {
		global: 'globalThis'
	},
	// アセットの取り扱い設定
	assetsInclude: ['**/*.svg'],
	// SVGファイルの取り扱い
	optimizeDeps: {
		include: ['@hugmedo/ui']
	},
	build: {
		commonjsOptions: {
			include: [/node_modules/, /packages\/ui/]
		}
	},
	test: {
		workspace: [
			{
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				plugins: [], // Added this line to fix the syntax error
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
