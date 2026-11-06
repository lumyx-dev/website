import * as React from "react";
import { cx } from "@/lib/cx";

export function useCopy() {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const copy = React.useCallback((text: string) => {
    void navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }, []);
  return { copied, copy };
}

/** Small "Copy" button used in panel headers. */
export function CopyButton({ text, className }: { text: string; className?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cx(
        "flex-none cursor-pointer rounded-xs border border-stroke bg-transparent px-3 py-1 text-12 text-muted transition-colors hover:text-strong active:scale-[0.98]",
        className,
      )}
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

/** The one-line command in the hero, styled as a secondary button: the whole button copies. */
export function CopyCommand({ command }: { command: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(command)}
      className="inline-flex max-w-full cursor-pointer items-center gap-2 rounded-sm border border-stroke bg-card px-3 py-2 text-left text-14 font-medium leading-5 text-strong transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-faint active:scale-[0.98]"
    >
      <span className="text-faint">$</span>
      <span className="sl-num min-w-0 [overflow-wrap:anywhere]">{command}</span>
      <span aria-live="polite" className="flex-none rounded-[6px] bg-inset px-2 text-12 leading-5 text-muted">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
