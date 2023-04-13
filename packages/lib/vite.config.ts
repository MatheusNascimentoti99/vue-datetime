import getBaseViteConfig from '../../viteBaseConfig'
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(getBaseViteConfig({
  build: {
    target: 'es2015',
    lib: {
      entry: resolve(__dirname, 'src/vue-datetime.ts'),
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
}));
