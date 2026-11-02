import { describe, expect, test } from "bun:test";
import { codeToHtml } from "shiki";
import { lumyxCodeTheme } from "@lumyx/ui/code-theme";
import { markdown } from "./markdown";

const SAMPLE = `{ "packet_loss_ratio": 0.079, "enabled": true }`;

async function render(code: string, lang: string) {
  return codeToHtml(code, { lang, theme: lumyxCodeTheme });
}

describe("coloration avec le theme lumyx", () => {
  test("n'emet aucune couleur litterale", async () => {
    const html = await render(SAMPLE, "json");
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(html).not.toMatch(/\brgba?\(/);
  });

  test("emet des variables CSS --code-* comme couleurs de token", async () => {
    const html = await render(SAMPLE, "json");
    expect(html).toContain("var(--code-");
  });

  test("distingue au moins trois roles sur un echantillon JSON", async () => {
    const html = await render(SAMPLE, "json");
    const roles = new Set(html.match(/var\(--code-[a-z]+\)/g) ?? []);
    expect(roles.size).toBeGreaterThanOrEqual(3);
  });

  test("colorie aussi Rust, TOML et shell — les langues de cette doc", async () => {
    for (const [code, lang] of [
      ['let peer = room.peer("ff104b2c")?;', "rust"],
      ['[collector]\nthresholds = true', "toml"],
      ['docker run -p 3000:3000 ghcr.io/lumyx-dev/sfu-core:latest', "bash"],
    ] as const) {
      const html = await render(code, lang);
      expect(html).toContain("var(--code-");
      expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    }
  });
});

// Le test ci-dessus prouve que Shiki SAIT appliquer le theme lumyx. Il ne prouve pas que
// src/lib/markdown.ts le branche bien dans Astro : une regression y est silencieuse (build vert,
// code recolore par le theme par defaut). Cette assertion transforme un futur oubli en test rouge.
describe("branchement de shikiConfig dans src/lib/markdown.ts", () => {
  test("le theme est lumyxCodeTheme, sans paire clair/sombre", () => {
    expect(markdown.shikiConfig.theme).toBe(lumyxCodeTheme);
    expect(markdown.shikiConfig).not.toHaveProperty("themes");
  });
});
