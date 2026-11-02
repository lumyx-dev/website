#!/usr/bin/env node
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SCANNED = ['src'].map((d) => join(ROOT, d));

// Seul fichier autorisé à porter une valeur de couleur littérale — c'est là que vivrait une
// valeur marketing-locale si jamais une apparaît. En pratique il n'y en a aucune.
const COLOR_EXEMPT = join(ROOT, 'src', 'styles', 'global.css');

const failures = [];
const fail = (rule, detail) => failures.push(`[${rule}] ${detail}`);

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = SCANNED.flatMap(walk);
const rel = (p) => p.slice(ROOT.length);

// 1. Aucune couleur en dur hors global.css
// #000/transparent inside a maskImage gradient is a luminance mask (opaque vs. hidden), not a
// paint colour — exempt those lines rather than the whole file, so a real colour slipped in
// alongside one still gets caught.
const SAFE_HEX_REF =
  /(?:\bxlink:href|\bhref)\s*=\s*(?:"#[^"]*"|'#[^']*'|\{\s*['"]#[^'"}]*['"]\s*\})|\burl\(\s*#[^)]*\)/g;
const HEX = /#[0-9a-fA-F]{3,8}\b/;
const RGB = /\brgba?\(/;
const MASK_IMAGE_LINE = /\b(?:mask-image|maskImage|WebkitMaskImage|-webkit-mask-image)\s*[:=]/;
for (const f of files) {
  if (f === COLOR_EXEMPT) continue;
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (MASK_IMAGE_LINE.test(line)) return;
      const scrubbed = line.replace(SAFE_HEX_REF, '');
      if (HEX.test(scrubbed) || RGB.test(scrubbed)) {
        fail('no-hardcoded-color', `${rel(f)}:${i + 1} — ${line.trim()}`);
      }
    });
}

// 2. Zéro monospace — un vrai font-family/classe, pas une mention en prose ("no monospace tier").
for (const f of files) {
  if (/\bfont-mono\b|ui-monospace|'SF Mono'|Menlo|Consolas/i.test(readFileSync(f, 'utf8'))) {
    fail('no-monospace', `${rel(f)} contient une font monospace`);
  }
}

// 3. Pas de HTML brut : ni dangerouslySetInnerHTML (React) ni set:html (Astro). Seule exception,
// set:html sur un <script type="application/ld+json"> — du JSON echappe, pas du balisage.
const DANGEROUS_HTML_USAGE = /dangerouslySetInnerHTML\s*[=:]/;
const SET_HTML = /set:html\s*=/g;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  if (DANGEROUS_HTML_USAGE.test(src)) fail('no-dangerous-html', rel(f));
  for (const m of src.matchAll(SET_HTML)) {
    const tag = src.slice(src.lastIndexOf('<', m.index), m.index);
    if (!/^<script\b[^>]*type="application\/ld\+json"/.test(tag)) fail('no-dangerous-html', rel(f));
  }
}

// 4. Zéro *.module.css — global.css est le seul fichier CSS de la landing.
for (const f of files) {
  if (extname(f) === '.css' && f !== COLOR_EXEMPT) {
    fail('no-css-modules', rel(f));
  }
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} violation(s) des contraintes du design system\n`);
  failures.forEach((f) => console.error('  ' + f));
  process.exit(1);
}
console.log('✓ contraintes du design system respectees (apps/landing)');
