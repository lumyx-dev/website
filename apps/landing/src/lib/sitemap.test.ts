import { describe, expect, test } from 'bun:test';
import { sitemapXml } from './sitemap';

describe('sitemap de la landing', () => {
  const xml = sitemapXml('https://lumyx.example', '2026-01-01T00:00:00.000Z');

  test("ne liste que l'accueil", () => {
    expect(xml.match(/<loc>/g)).toHaveLength(1);
    expect(xml).toContain('<loc>https://lumyx.example</loc>');
  });

  test('ne liste aucune route desactivee ni la doc', () => {
    for (const path of ['/pricing', '/changelog', '/blog', '/docs']) {
      expect(xml).not.toContain(`https://lumyx.example${path}<`);
    }
  });
});
