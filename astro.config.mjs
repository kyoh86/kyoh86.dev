// @ts-check
import mdx from '@astrojs/mdx';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://kyoh86.dev',
	integrations: [mdx()],
	fonts: [
    {
      provider: fontProviders.googleicons(),
      name: 'Material Symbols Outlined',
      cssVariable: '--font-symbols',
      options: {
        experimental: {
					glyphs: ['article', 'code', 'mic', 'pets', 'raven', 'read_more', 'splitscreen', 'travel_explore'],
        },
      },
    },
  ],
});
