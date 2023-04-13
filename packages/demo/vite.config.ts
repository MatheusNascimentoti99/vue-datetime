import getBaseViteConfig from '../../viteBaseConfig';
import { defineConfig } from 'vite';

export default defineConfig(getBaseViteConfig({
  server: {
    port: 8080,
    fs: {
      // Allowing serving files from one level up to the project root
      allow: ['../..'],
    },
  },
}))
