import type { SitemapItem } from '@astrojs/sitemap';

/**
 * Options de @astrojs/sitemap pour la doc : les squelettes sont exclus, l'accueil est prioritaire,
 * et aucune `lastmod` — une date de build reaffirmee a chaque deploiement serait un faux signal.
 */
export function sitemapOptions(siteUrl: string, stubs: string[]) {
  const excluded = new Set(stubs.map((slug) => `${siteUrl}/${slug}`));
  const isHome = (url: string) => url.replace(/\/$/, '') === siteUrl;
  return {
    filter: (page: string) => !excluded.has(page.replace(/\/$/, '')),
    serialize: (item: SitemapItem): SitemapItem => ({
      ...item,
      changefreq: 'weekly' as SitemapItem['changefreq'],
      priority: isHome(item.url) ? 1 : 0.7,
    }),
  };
}
