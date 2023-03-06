import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { resolve } from 'path';

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
  },
  build: {
    target: 'es2015',
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      fileName: 'vue-datetime',
      name: 'vue-datetime.[name]'
    },
    rollupOptions: {
      external: ['luxon', 'vue', 'weekstart'],
      output: {
        globals: {
          vue: 'vue',
          luxon: 'luxon',
          weekstart: 'weekstart'
        },
        exports: 'named'
      }
    }
  }
});
