import type { AstroUserConfig } from 'astro';

/**
 * La documentation a demenage sur son propre sous-domaine. `/docs` nu, l'URL la plus liee, est une
 * redirection statique (301 dans la config Vercel, sans fonction). Les sous-chemins passent par
 * src/pages/docs/[...path].ts : Astro ne sait pas prerendre une redirection dynamique vers une
 * origine externe.
 */
export function docsRedirects(docsUrl: string): NonNullable<AstroUserConfig['redirects']> {
  return {
    '/docs': { status: 301, destination: docsUrl },
  };
}

/** Destination d'un sous-chemin de /docs, query string comprise. */
export function docsLocation(docsUrl: string, path: string | undefined, search = ''): string {
  return `${docsUrl}/${path ?? ''}${search}`;
}
