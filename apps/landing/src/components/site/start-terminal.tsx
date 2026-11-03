import * as React from "react";
import { cx } from "@/lib/cx";
import { START, type StartKey } from "@/lib/home-data";
import { CopyButton } from "./copy";

const KEYS = Object.keys(START) as StartKey[];

/** The closing terminal: three ways to start, one copy button for the active one. */
export function StartTerminal() {
  const [active, setActive] = React.useState<StartKey>("docker");
  const lines = START[active].lines;
  const copyText = lines.filter((l) => !l.dim).map((l) => l.href ?? l.v).join("\n");

  return (
    <div className="dark overflow-hidden rounded-xs border border-stroke bg-card text-body">
      <div className="flex items-center overflow-x-auto border-b border-hairline" role="tablist">
        {KEYS.map((k) => {
          const on = active === k;
          return (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(k)}
              className={cx(
                "sl-num h-12 flex-none cursor-pointer border-0 bg-transparent px-5 text-13 hover:text-strong",
                on ? "text-strong shadow-[inset_0_-2px_0_var(--accent)]" : "text-muted",
              )}
            >
              {START[k].label}
            </button>
          );
        })}
        <span className="flex-1" />
        <CopyButton text={copyText} className="mr-3 h-[30px] px-3" />
      </div>
      <div role="tabpanel" className="flex min-h-[140px] flex-col gap-1.5 overflow-x-auto px-[clamp(20px,3vw,32px)] py-[clamp(20px,3vw,36px)]">
        {lines.map((l, i) => (
          <div key={i} className="sl-num flex gap-3.5 text-[clamp(13px,1.3vw,17px)] leading-relaxed">
            <span className="flex-none text-faint">{l.p}</span>
            {l.href ? (
              <a href={l.href} className="text-strong [overflow-wrap:anywhere] hover:text-accent-text">
                {l.v}
              </a>
            ) : (
              <span className={cx("[overflow-wrap:anywhere]", l.dim ? "text-faint" : "text-strong")}>{l.v}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
