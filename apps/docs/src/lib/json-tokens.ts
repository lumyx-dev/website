/**
 * Coloration minimale des exemples JSON de la page Metrics reference (maquette Docs v3).
 * Rend des classes de tokens, pas des couleurs : les panneaux de code sont toujours sombres
 * (classe `.dark`), et les tokens y prennent leur valeur sombre.
 */
export type Token = { v: string; cls: string };

const CLS = { key: "text-accent-text", str: "text-accent2", num: "text-ok", dim: "text-faint", txt: "text-body" };
const RE = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(\d+(?:\.\d+)?)\b|([{}[\],:])/g;

export function tokenizeJson(line: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(line))) {
    if (m.index > i) out.push({ v: line.slice(i, m.index), cls: CLS.txt });
    if (m[1]) {
      out.push({ v: m[1], cls: m[2] ? CLS.key : CLS.str });
      if (m[2]) out.push({ v: m[2], cls: CLS.dim });
    } else if (m[3]) out.push({ v: m[3], cls: CLS.num });
    else out.push({ v: m[4]!, cls: CLS.dim });
    i = RE.lastIndex;
  }
  if (i < line.length) out.push({ v: line.slice(i), cls: CLS.txt });
  return out.length ? out : [{ v: " ", cls: CLS.txt }];
}

/** TOML : commentaires estompes, sections en accent, le reste en texte. */
export function tokenizeToml(line: string): Token[] {
  const cls = line.startsWith("#") ? CLS.dim : line.startsWith("[") ? CLS.key : CLS.txt;
  return [{ v: line || " ", cls }];
}
