import { describe, expect, test } from "bun:test";
import config from "./next.config";

const DOCS = "https://docs.lumyx.dev";

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
