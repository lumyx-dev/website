import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/env';
import { sitemapXml } from '@/lib/sitemap';

export const GET: APIRoute = () =>
  new Response(sitemapXml(SITE_URL, new Date().toISOString()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
