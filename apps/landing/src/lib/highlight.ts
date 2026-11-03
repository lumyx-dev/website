import type { CodeLang } from "@/lib/home-data";

/**
 * A deliberately small tokenizer — enough to colour the four snippet languages on the home page
 * without pulling a highlighter into the bundle. Colours are design-system CSS variables.
 */
export type Token = { v: string; c: string };

const C = {
  key: "var(--indigo-400)",
  str: "var(--coral-400)",
  num: "var(--green-400)",
  kw: "var(--amber-400)",
  dim: "var(--n-500)",
  txt: "var(--n-200)",
  sec: "var(--accent-text)",
};

const GENERIC =
  /("(?:[^"\\]|\\.)*")(\s*:)?|(\s#.*$|\/\/.*$)|\b(\d+(?:\.\d+)?)\b|\b(import|from|const|await|new|true|false)\b|([{}[\](),:;=])/g;

function generic(s: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  let m: RegExpExecArray | null;
  GENERIC.lastIndex = 0;
  while ((m = GENERIC.exec(s))) {
    if (m.index > i) out.push({ v: s.slice(i, m.index), c: C.txt });
    if (m[1]) {
      out.push({ v: m[1], c: m[2] ? C.key : C.str });
      if (m[2]) out.push({ v: m[2], c: C.dim });
    } else if (m[3]) out.push({ v: m[3], c: C.dim });
    else if (m[4]) out.push({ v: m[4], c: C.num });
    else if (m[5]) out.push({ v: m[5], c: C.kw });
    else out.push({ v: m[6], c: C.dim });
    i = GENERIC.lastIndex;
  }
  if (i < s.length) out.push({ v: s.slice(i), c: C.txt });
  return out;
}

export function tokenize(line: string, lang: CodeLang): Token[] {
  if (!line.trim()) return [{ v: " ", c: C.txt }];
  if (/^\s*(#|\/\/)/.test(line)) return [{ v: line, c: C.dim }];
  if (lang === "toml") {
    if (/^\s*\[.*\]\s*$/.test(line)) return [{ v: line, c: C.sec }];
    const m = line.match(/^(\s*)([\w.-]+)(\s*=\s*)(.*)$/);
    if (m) return [{ v: m[1], c: C.txt }, { v: m[2], c: C.key }, { v: m[3], c: C.dim }, ...generic(m[4])];
  }
  if (lang === "prom") {
    const m = line.match(/^([a-z_]+)(\{[^}]*\})?(\s+)(.*)$/);
    if (m) return [{ v: m[1], c: C.key }, { v: m[2] ?? "", c: C.str }, { v: m[3], c: C.txt }, { v: m[4], c: C.num }];
  }
  return generic(line);
}
