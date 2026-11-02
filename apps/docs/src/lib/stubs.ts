import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Les onze squelettes portent `stub: true` en frontmatter. Leur corps n'est qu'un avertissement et
 * des titres vides : ils restent dans la nav, mais sortent du sitemap et recoivent un `noindex`
 * (src/route-middleware.ts). Le champ s'appelait `draft` sous Fumadocs ; Starlight reserve ce nom
 * a des pages exclues du build de production, ce qui retirerait les squelettes de la nav.
 *
 * Lu directement sur le disque plutot que via `astro:content` : astro.config.ts en a besoin pour
 * filtrer le sitemap, avant que la collection n'existe.
 */
export function stubSlugs(contentDir: string): string[] {
  return readdirSync(contentDir)
    .filter((f) => /\.mdx?$/.test(f))
    .filter((f) => {
      const frontmatter = /^---\n([\s\S]*?)\n---/.exec(readFileSync(join(contentDir, f), 'utf8'));
      return frontmatter ? /^stub:\s*true\s*$/m.test(frontmatter[1]!) : false;
    })
    .map((f) => f.replace(/\.mdx?$/, ''))
    .sort();
}
