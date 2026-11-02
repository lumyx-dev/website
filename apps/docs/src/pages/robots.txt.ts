import type { APIRoute } from 'astro';
import { DOCS_URL } from '@/lib/env';

// `Allow: /` reste general : les squelettes portent leur propre exclusion (noindex via
// src/route-middleware.ts, absence du sitemap). Un `Disallow` les empecherait d'etre crawles, donc
// d'etre vus comme `noindex`.
export const GET: APIRoute = () =>
  new Response(`User-Agent: *\nAllow: /\n\nSitemap: ${DOCS_URL}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
