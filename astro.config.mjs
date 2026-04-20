// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://claimour.com',
  output: 'server',
  vite: {
    plugins: [tailwindcss()]
  },
  adapter: node({ mode: 'standalone' }),
});