import * as React from "react";
import { cx } from "@/lib/cx";
import { START, type StartKey } from "@/lib/home-data";
import { CopyButton } from "./copy";

const KEYS = Object.keys(START) as StartKey[];

/** Quickstart terminal: docker or cargo, one copy button for the active one. Always dark. */
export function StartTerminal() {
  const [active, setActive] = React.useState<StartKey>("docker");
  const lines = START[active].lines;
  const copyText = lines.filter((l) => !l.dim).map((l) => l.v).join("\n");

  return (
    <div className="rounded-xl border border-stroke bg-sunken p-2">
      <div className="dark overflow-hidden rounded-lg bg-page text-body">
        <div className="flex items-center gap-2 border-b border-hairline px-4 py-3" role="tablist" aria-label="Install method">
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
                  "sl-num cursor-pointer rounded-xs border-0 px-3 py-1 text-12",
                  on ? "bg-active text-strong" : "bg-transparent text-muted hover:text-strong",
                )}
              >
                {START[k].label}
              </button>
            );
          })}
          <span className="flex-1" />
          <CopyButton text={copyText} />
        </div>
        <div role="tabpanel" className="sl-scroll flex min-h-[200px] flex-col gap-2 overflow-x-auto p-6 text-14 leading-6">
          {lines.map((l, i) => (
            <div key={i} className="sl-num flex gap-3 whitespace-pre">
              <span className="flex-none text-faint">{l.p}</span>
              <span className={l.dim ? "text-faint" : "text-strong"}>{l.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
