import order from './sidebar.json';

/**
 * Ordre de la navigation, repris tel quel du `meta.json` de Fumadocs : une entree `---Titre---`
 * ouvre une section, les autres sont des slugs de src/content/docs. Les squelettes (`stub: true`)
 * y restent — la nav doit rester complete.
 */
export type SidebarGroup = { label: string; items: string[] };

export function sidebarGroups(pages: string[] = order.pages): SidebarGroup[] {
  const groups: SidebarGroup[] = [];
  for (const entry of pages) {
    const separator = /^---(.+)---$/.exec(entry);
    if (separator) groups.push({ label: separator[1]!, items: [] });
    else if (groups.length) groups.at(-1)!.items.push(entry);
    else throw new Error(`sidebar.json : « ${entry} » precede la premiere section`);
  }
  return groups;
}
