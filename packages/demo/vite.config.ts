import getBaseViteConfig from '../../viteBaseConfig';
import { AliasOptions, ConfigEnv, defineConfig } from 'vite';
import { resolve } from 'path';

export default ({ mode }: ConfigEnv) => {
  const aliases: AliasOptions = {
    'vue-datetime': (mode === 'development') ?
      resolve(__dirname, '../lib/src/vue-datetime') : 'vue-datetime3',
  }
  return defineConfig(getBaseViteConfig({
    server: {
      port: 8080,
      fs: {
        // Allowing serving files from one level up to the project root
        allow: ['../..'],
      },
    },
    resolve: {
      alias: aliases,
    },
  }));
}
