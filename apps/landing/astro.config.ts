import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { docsRedirects } from './src/redirects';

// Lu au build, pas au runtime : le site est entierement statique.
const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://lumyx.dev';
const DOCS_URL = process.env.PUBLIC_DOCS_URL ?? 'https://docs.lumyx.dev';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  // L'adaptateur transforme les redirections en vraies 301 cote Vercel ; sans lui, un site
  // statique n'aurait que des <meta http-equiv="refresh">.
  adapter: vercel(),
  integrations: [
    // `experimentalReactChildren` convertit le HTML passe depuis un .astro en elements React :
    // `<Button asChild><a/></Button>` fonctionne, et aucun <astro-slot> ne s'intercale entre un
    // conteneur flex/grid de @lumyx/ui et ses enfants.
    react({ experimentalReactChildren: true }),
  ],
  redirects: docsRedirects(DOCS_URL),
  vite: {
    plugins: [tailwindcss()],
  },
});
