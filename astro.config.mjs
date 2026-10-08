// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.googleicons(),
      name: 'Material Symbols Outlined',
      cssVariable: '--font-symbols',
      options: {
        experimental: {
          glyphs: ['code', 'mic', 'splitscreen', 'travel_explore', 'raven', 'pets'],
        },
      },
    },
  ],
});
