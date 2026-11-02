import { describe, expect, test } from 'bun:test';
import { docsLocation, docsRedirects } from './redirects';

const DOCS = 'https://docs.example.dev';

describe('redirections de /docs vers le sous-domaine', () => {
  test("redirige /docs nu, l'URL la plus liee des deux, en 301", () => {
    expect(docsRedirects(DOCS)['/docs']).toEqual({ status: 301, destination: DOCS });
  });

  test('redirige les sous-chemins en conservant le chemin', () => {
    expect(docsLocation(DOCS, 'quickstart')).toBe(`${DOCS}/quickstart`);
    expect(docsLocation(DOCS, 'api/rooms')).toBe(`${DOCS}/api/rooms`);
  });

  test('conserve la query string', () => {
    expect(docsLocation(DOCS, 'quickstart', '?ref=x')).toBe(`${DOCS}/quickstart?ref=x`);
  });
});
