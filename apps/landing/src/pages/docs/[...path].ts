import type { APIRoute } from 'astro';
import { DOCS_URL } from '@/lib/env';
import { docsLocation } from '@/redirects';

// Rendu a la demande : une redirection dynamique vers une autre origine ne se prerend pas.
export const prerender = false;

export const GET: APIRoute = ({ params, url }) =>
  new Response(null, {
    status: 301,
    headers: { Location: docsLocation(DOCS_URL, params.path, url.search) },
  });
