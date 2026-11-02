import { describe, expect, test } from "bun:test";
import { fileURLToPath } from "node:url";
import { sidebarGroups } from "./sidebar";
import { sitemapOptions } from "./sitemap";
import { stubSlugs } from "./stubs";

// Meme expression qu'astro.config.ts, deliberement : le test doit suivre la variable, pas un
// domaine — un litteral ferait rougir la suite sur toute URL de preview.
const DOCS_URL = process.env.PUBLIC_DOCS_URL ?? "https://docs.lumyx.dev";
const CONTENT = fileURLToPath(new URL("../content/docs", import.meta.url));

const STUBS = [
  "alerting", "api", "config", "errors", "forwarding", "peers",
  "prometheus", "replay", "rooms", "signaling", "topology",
];

describe("squelettes", () => {
  test("les onze pages `stub: true` sont detectees", () => {
    expect(stubSlugs(CONTENT)).toEqual(STUBS);
  });

  test("ils restent dans la sidebar", () => {
    const slugs = sidebarGroups().flatMap((g) => g.items);
    for (const slug of STUBS) expect(slugs).toContain(slug);
  });
});

describe("sitemap", () => {
  const { filter, serialize } = sitemapOptions(DOCS_URL, stubSlugs(CONTENT));
  const pages = ["", ...sidebarGroups().flatMap((g) => g.items).filter((s) => s !== "index")].map(
    (slug) => (slug ? `${DOCS_URL}/${slug}` : `${DOCS_URL}/`),
  );
  const kept = pages.filter(filter);

  test("garde les cinq pages redigees, sans les onze squelettes", () => {
    expect(kept).toHaveLength(5);
    for (const slug of STUBS) expect(kept).not.toContain(`${DOCS_URL}/${slug}`);
  });

  test("ignore la barre finale", () => {
    expect(filter(`${DOCS_URL}/api/`)).toBe(false);
    expect(filter(`${DOCS_URL}/quickstart/`)).toBe(true);
  });

  test("l'accueil est prioritaire, les autres a 0.7", () => {
    expect(serialize({ url: `${DOCS_URL}/` }).priority).toBe(1);
    expect(serialize({ url: DOCS_URL }).priority).toBe(1);
    expect(serialize({ url: `${DOCS_URL}/quickstart` }).priority).toBe(0.7);
  });
});

describe("sidebar", () => {
  test("une entree avant la premiere section est refusee", () => {
    expect(() => sidebarGroups(["index", "---A---"])).toThrow();
  });

  test("chaque slug pointe vers une page existante", () => {
    const files = new Set(
      [...new Bun.Glob("*.mdx").scanSync(CONTENT)].map((f) => f.replace(/\.mdx$/, "")),
    );
    for (const slug of sidebarGroups().flatMap((g) => g.items)) expect(files).toContain(slug);
  });
});
