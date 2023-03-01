import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // @ts-ignore
      '@': fileURLToPath(new URL('./demo/src', import.meta.url)),
      // @ts-ignore
      '~': fileURLToPath(new URL('./node_modules', import.meta.url))
    },
    extensions: [
      '.js',
      '.ts',
      '.vue',
      '.json',
      '.css'
    ]
  },
  server: {
    port: 8080,
    fs: {
      // Allowing serving files from one level up to the project root
      allow: ['..', './demo'],
    },
    open: 'demo/index.html',
    base: 'demo'
  }
});
