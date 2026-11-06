import type { MdastPluginDefinition } from 'satteri';

/**
 * Ancres epinglees : `## Jitter [#jitter_ms]` rend `<h2 id="jitter_ms">Jitter</h2>`.
 * La syntaxe vient de Fumadocs ; Starlight ne la connait pas et laissait `[#jitter_ms]` dans le
 * titre et le sommaire, avec une ancre `#jitter-jitter_ms`. Le plugin retire le suffixe et pose
 * l'`id` ; le plugin d'ancres d'Astro garde un `id` existant, donc le sommaire suit.
 *
 * Plugin Satteri (le moteur Markdown par defaut d'Astro 7), pas remark : `markdown.remarkPlugins`
 * n'est lu que par l'ancien moteur unified.
 */
const PINNED = /\s*\[#([\w-]+)\]\s*$/;

/** `"Jitter [#jitter_ms]"` → `{ text: "Jitter", id: "jitter_ms" }` ; `null` sans ancre epinglee. */
export function splitPinnedId(value: string): { text: string; id: string } | null {
  const m = PINNED.exec(value);
  return m ? { text: value.slice(0, m.index), id: m[1]! } : null;
}

export const pinnedHeadingIds: MdastPluginDefinition = {
  name: 'lumyx-pinned-heading-ids',
  heading(node, ctx) {
    const last = node.children.at(-1);
    if (last?.type !== 'text') return;
    const pinned = splitPinnedId(last.value);
    if (!pinned) return;
    ctx.setProperty(last, 'value', pinned.text);
    // `hProperties` est lu au passage en hast mais absent du type `HeadingData`.
    const data = node.data as { hProperties?: Record<string, unknown> } | undefined;
    ctx.setProperty(node, 'data', { ...data, hProperties: { ...data?.hProperties, id: pinned.id } });
  },
};
