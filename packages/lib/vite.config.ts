/// <reference types="vitest" />
import { fileURLToPath } from 'node:url';
import { resolve } from 'path';

import { defineConfig } from 'vite';

import getBaseViteConfig from '../../viteBaseConfig';

export default defineConfig(getBaseViteConfig({
  build: {
    target: 'es2015',
    lib: {
      entry: resolve(__dirname, 'src/vue-datetime.ts'),
      fileName: 'vue-datetime',
      name: 'vue-datetime.[name]',
    },
    rollupOptions: {
      external: ['luxon', 'vue', 'weekstart'],
      output: {
        globals: {
          vue: 'vue',
          luxon: 'luxon',
          weekstart: 'weekstart',
        },
        exports: 'named',
      },
    },
  },
  resolve: {
    alias: {
      // @ts-ignore
      '~': fileURLToPath(new URL('../../node_modules', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.ts',
      '.vue',
      '.json',
      '.css',
    ],
  },
  test: {
    include: ['./test/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    environment: 'jsdom',
    useAtomics: true, // eliminate tests hang at the end (https://github.com/vitest-dev/vitest/issues/2008)
  },
}));
