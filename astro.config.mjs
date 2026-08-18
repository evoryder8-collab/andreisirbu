import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

// site/base are set for GitHub Pages project-page hosting.
// At production cutover these change to the real domain and base becomes '/'.
export default defineConfig({
  site: 'https://evoryder8-collab.github.io',
  base: '/andreisirbu',
  vite: { plugins: [tailwind()] },
});
