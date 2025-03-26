import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 40010,
    strictPort: true
  },
  resolve: {
    alias: {
      '@hugmedo/ui': resolve(__dirname, '../../packages/ui')
    }
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
  define: {
    global: 'globalThis'
  }
});
