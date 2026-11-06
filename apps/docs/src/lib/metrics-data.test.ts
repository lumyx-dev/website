import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { METRICS } from "./metrics-data";
import { MetricsGlance } from "../components/metrics-reference";
import { tokenizeJson } from "./json-tokens";

describe("donnees des metriques", () => {
  test("porte les six metriques du collecteur", () => {
    expect(METRICS).toHaveLength(6);
    expect(METRICS.map((m) => m.field)).toEqual([
      "packet_loss_ratio",
      "rtt_ms",
      "jitter_ms",
      "nack_ratio",
      "freeze_ratio",
      "bitrate_kbps",
    ]);
  });

  test("chaque metrique porte les neuf champs que la page rend", () => {
    for (const m of METRICS) {
      for (const key of ["name", "field", "unit", "threshold", "scope", "breaks", "body", "action"] as const) {
        expect(typeof m[key]).toBe("string");
        expect(m[key].length).toBeGreaterThan(0);
      }
      expect(Array.isArray(m.sample)).toBe(true);
      expect(m.sample.length).toBeGreaterThan(0);
    }
  });

  test("les champs servent d'ancres, donc ils sont uniques", () => {
    expect(new Set(METRICS.map((m) => m.field)).size).toBe(METRICS.length);
  });
});

describe("MetricsGlance", () => {
  // La grille « At a glance » est la seule vue d'ensemble des six metriques : une carte perdue
  // ne casse rien et ne se voit pas. On compte les cartes et on verifie leurs valeurs.
  const html = renderToStaticMarkup(createElement(MetricsGlance));

  test("rend une carte par metrique, qui renvoie a sa section", () => {
    expect(html.match(/<a\b/g) ?? []).toHaveLength(METRICS.length);
    for (const m of METRICS) expect(html).toContain(`href="#${m.field}"`);
  });

  test("chaque carte porte le nom, le seuil, ce qu'elle casse et le champ", () => {
    for (const m of METRICS) {
      for (const value of [m.name, m.threshold, m.breaks, m.field]) {
        expect(html).toContain(escapeHtml(value));
      }
    }
  });

  test("les seuils gardent les chiffres tabulaires", () => {
    expect(html.match(/class="[^"]*\bsl-num\b[^"]*"/g) ?? []).toHaveLength(METRICS.length);
  });
});

describe("tokenizeJson", () => {
  test("restitue chaque ligne d'exemple a l'identique", () => {
    for (const m of METRICS) {
      for (const line of m.sample) {
        expect(tokenizeJson(line).map((t) => t.v).join("")).toBe(line);
      }
    }
  });
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
