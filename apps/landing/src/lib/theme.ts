/**
 * Theme clair/sombre, sans next-themes. Meme cle de stockage (`theme`) et meme defaut (sombre,
 * sans suivi du systeme) qu'avant la migration, pour qu'un visiteur retrouve son choix.
 * Le script inline de src/layouts/base.astro applique le theme avant le premier rendu.
 */
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Stockage indisponible (navigation privee stricte) : le choix vaut pour la page.
  }
}
