// Routes publiques de la landing. /docs a demenage sur docs.lumyx.dev, qui porte son propre
// sitemap. Routes desactivees (src/pages/_pricing, _changelog, _blog) — pas d'URL morte ici :
//   { path: '/pricing', changefreq: 'monthly', priority: 0.8 },
//   { path: '/changelog', changefreq: 'weekly', priority: 0.5 },
//   { path: '/blog', changefreq: 'weekly', priority: 0.7 },
// Les articles (BLOG_POSTS de src/lib/blog-data.ts) reviendront avec /blog, en changefreq
// 'monthly', priority 0.6 et lastmod = date de l'article.
export const ROUTES = [{ path: '', changefreq: 'weekly', priority: 1 }] as const;

export function sitemapXml(siteUrl: string, lastmod: string): string {
  const urls = ROUTES.map(
    (r) =>
      `  <url>\n    <loc>${siteUrl}${r.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
      `    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
  );
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${urls.join('\n')}\n</urlset>\n`
  );
}
