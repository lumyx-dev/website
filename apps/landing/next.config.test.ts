import { describe, expect, test } from "bun:test";
import config from "./next.config";

// Meme expression que next.config.ts, et non un domaine ecrit en dur : les redirections se
// construisent sur NEXT_PUBLIC_DOCS_URL. Un litteral faisait rougir la suite des qu'on lui donnait
// une URL de preview, un domaine de staging ou un localhost — c'est-a-dire exactement quand on a
// besoin qu'elle soit lisible.
const DOCS = process.env.NEXT_PUBLIC_DOCS_URL ?? "https://docs.lumyx.dev";

describe("redirections de /docs vers le sous-domaine", () => {
  test("declare une fonction redirects", () => {
    expect(typeof config.redirects).toBe("function");
  });

  test("redirige /docs nu, l'URL la plus liee des deux", async () => {
    const rules = await config.redirects!();
    const bare = rules.find((r) => r.source === "/docs");
    expect(bare).toBeDefined();
    expect(bare?.destination).toBe(DOCS);
    expect(bare?.permanent).toBe(true);
  });

  test("redirige les sous-chemins en conservant le chemin", async () => {
    const rules = await config.redirects!();
    const nested = rules.find((r) => r.source === "/docs/:path*");
    expect(nested).toBeDefined();
    expect(nested?.destination).toBe(`${DOCS}/:path*`);
    expect(nested?.permanent).toBe(true);
  });
});
