import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// site/base are set for GitHub Pages project-page hosting.
// At production cutover these change to the real domain and base becomes '/'.
export default defineConfig({
  site: 'https://evoryder8-collab.github.io',
  base: '/andreisirbu',
  integrations: [
    sitemap({
      // The locale homepages are the only translated routes, so they are the
      // only ones that get alternate links. Claiming more would point search
      // engines at pages that do not exist.
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', de: 'de', fr: 'fr', it: 'it', es: 'es', ro: 'ro' },
      },
    }),
  ],
  vite: { plugins: [tailwind()] },
});
