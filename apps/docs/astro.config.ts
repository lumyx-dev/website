import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { markdown } from './src/lib/markdown';
import { sidebarGroups } from './src/lib/sidebar';
import { sitemapOptions } from './src/lib/sitemap';
import { REPO } from './src/lib/site-data';
import { stubSlugs } from './src/lib/stubs';

// Lu au build : la doc est entierement statique.
const DOCS_URL = process.env.PUBLIC_DOCS_URL ?? 'https://docs.lumyx.dev';
const stubs = stubSlugs(fileURLToPath(new URL('./src/content/docs', import.meta.url)));

export default defineConfig({
  site: DOCS_URL,
  // Memes URLs que sous Next : /quickstart, sans barre finale.
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel(),
  markdown,
  integrations: [
    starlight({
      title: 'Lumyx docs',
      titleDelimiter: '—',
      description:
        'Run, self-host and observe a Lumyx SFU: quickstart, deployment, the six media-path metrics and the REST API.',
      social: [{ icon: 'github', label: 'GitHub', href: REPO }],
      sidebar: sidebarGroups().map((group) => ({ label: group.label, items: group.items })),
      customCss: ['./src/styles/global.css'],
      expressiveCode: false,
      routeMiddleware: './src/route-middleware.ts',
      components: {
        ThemeProvider: './src/components/starlight/ThemeProvider.astro',
        ThemeSelect: './src/components/starlight/ThemeSelect.astro',
        PageTitle: './src/components/starlight/PageTitle.astro',
        SiteTitle: './src/components/starlight/SiteTitle.astro',
      },
    }),
    // Voir apps/landing/astro.config.ts : les enfants passes depuis le MDX deviennent des
    // elements React, ce qui garde intactes les tables imbriquees de @lumyx/ui.
    react({ experimentalReactChildren: true }),
    // Declare ici, Starlight n'ajoute pas le sien : c'est ce qui permet d'exclure les squelettes.
    sitemap(sitemapOptions(DOCS_URL, stubs)),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
