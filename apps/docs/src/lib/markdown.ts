import { lumyxCodeTheme } from '@lumyx/ui/code-theme';

/**
 * Coloration du code. Expressive Code (le defaut de Starlight) est coupe : il calcule ses propres
 * contrastes a partir de couleurs litterales et ne sait pas lire un theme peint en variables CSS.
 * Le Shiki d'Astro accepte `lumyxCodeTheme` tel quel : chaque token sort en `color: var(--code-*)`,
 * sans couleur litterale, et le mode sombre suit les tokens.
 */
export const markdown = {
  shikiConfig: { theme: lumyxCodeTheme },
};
