import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Deploy target comes from the environment so one source tree can produce
// both the GitHub Pages preview and a build for his own server:
//   SITE_URL=https://andreisirbu.com SITE_BASE=/preview npm run build
// CI sets neither, so the Pages preview keeps its existing paths.
export default defineConfig({
  site: process.env.SITE_URL || 'https://evoryder8-collab.github.io',
  base: process.env.SITE_BASE ?? '/andreisirbu',
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
