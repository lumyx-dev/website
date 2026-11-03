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

/** Small outlined "Copy" button used in panel headers. */
export function CopyButton({ text, className }: { text: string; className?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cx(
        "h-7 flex-none rounded-[6px] border border-stroke bg-transparent px-2.5 text-12 text-muted transition-transform hover:text-strong active:scale-[0.98]",
        className,
      )}
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

/** The one-line command in the hero: the whole row is the copy target. */
export function CopyCommand({ command }: { command: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(command)}
      className="flex min-h-11 max-w-[560px] cursor-pointer items-center gap-3 rounded-xs border border-stroke bg-sunken py-2 pl-4 pr-2 text-left text-13 transition-[transform,border-color] hover:border-faint active:scale-[0.98]"
    >
      <span className="text-faint">$</span>
      <span className="sl-num min-w-0 flex-1 leading-normal text-body [overflow-wrap:anywhere]">{command}</span>
      <span aria-live="polite" className="flex-none rounded-[6px] bg-hover px-2 py-1 text-12 text-muted">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
