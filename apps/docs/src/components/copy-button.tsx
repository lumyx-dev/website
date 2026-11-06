import * as React from "react";

/** Bouton « Copy » des panneaux de code. Ilot React : seul morceau interactif de la page. */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1600);
      }}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className="cursor-pointer rounded-[6px] border border-stroke bg-transparent px-2 py-1 text-12 text-muted transition-colors hover:text-strong"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
