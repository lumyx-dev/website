import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { setTheme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  // null pendant le rendu serveur et l'hydratation : le theme n'est connu qu'apres le script
  // inline du layout, donc le bouton ne s'engage sur une icone qu'une fois monte.
  const isDark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => null,
  );

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark === null ? "Toggle theme" : `Switch to ${isDark ? "light" : "dark"} mode`}
      className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-sm border border-hairline text-muted hover:bg-hover hover:text-strong"
    >
      {isDark === null ? <span className="h-[15px] w-[15px]" /> : isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
