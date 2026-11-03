import * as React from "react";
import { cx } from "@/lib/cx";
import { SNIPPETS, STEPS, type SnippetKey } from "@/lib/home-data";
import { tokenize } from "@/lib/highlight";
import { CopyButton } from "./copy";

const TABS = Object.keys(SNIPPETS) as SnippetKey[];

/** Three steps on the left drive the tabbed code panel on the right. */
export function ConfigPanel({ children }: { children?: React.ReactNode }) {
  const [tab, setTab] = React.useState<SnippetKey>("toml");
  const [hl, setHl] = React.useState<[number, number] | null>(null);
  const [step, setStep] = React.useState(0);
  const snip = SNIPPETS[tab];
  const range = hl ?? snip.hl;

  return (
    <div className="grid grid-cols-1 items-start gap-[clamp(32px,5vw,72px)] min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div data-reveal="0" className="flex min-w-0 flex-col gap-7">
        {children}
        <div className="flex flex-col border-t border-hairline">
          {STEPS.map((st, i) => {
            const on = step === i;
            return (
              <button
                key={st.n}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setStep(i);
                  setTab(st.tab);
                  setHl(st.hl);
                }}
                className={cx(
                  "grid cursor-pointer grid-cols-[36px_minmax(0,1fr)] gap-x-3 gap-y-1 border-0 border-b border-hairline py-[18px] pl-3.5 text-left hover:bg-hover",
                  on && "bg-hover shadow-[inset_2px_0_0_var(--accent)]",
                )}
              >
                <span className={cx("sl-num pt-0.5 text-13", on ? "text-accent-text" : "text-faint")}>{st.n}</span>
                <span className="flex items-center gap-2.5 text-16 font-semibold tracking-[-0.01em] text-strong">
                  {st.title}
                  {st.planned && (
                    <span className="rounded-[4px] border border-dashed border-stroke px-1.5 py-px text-11 font-normal text-faint">
                      planned
                    </span>
                  )}
                </span>
                <span />
                <span className="pr-3 text-14 leading-[1.55] text-muted text-pretty">{st.body}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code always reads on a dark ground, whatever the page theme. */}
      <div data-reveal="80" className="dark min-w-0 overflow-hidden rounded-xs border border-stroke bg-card text-body">
        <div className="flex items-center overflow-x-auto border-b border-hairline" role="tablist">
          {TABS.map((k) => {
            const on = tab === k;
            return (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setTab(k);
                  setHl(null);
                  setStep(STEPS.findIndex((x) => x.tab === k));
                }}
                className={cx(
                  "sl-num h-11 flex-none cursor-pointer border-0 bg-transparent px-4 text-12 hover:text-strong",
                  on ? "text-strong shadow-[inset_0_-2px_0_var(--accent)]" : "text-muted",
                )}
              >
                {SNIPPETS[k].label}
              </button>
            );
          })}
          <span className="flex-1" />
          <CopyButton text={snip.lines.join("\n")} className="mr-2.5" />
        </div>
        <div role="tabpanel" className="sl-scroll min-h-[440px] overflow-x-auto py-3.5">
          {snip.lines.map((line, i) => {
            const on = i + 1 >= range[0] && i + 1 <= range[1];
            return (
              <div key={i} className={cx("flex min-h-[22px]", on && "bg-accent-tint shadow-[inset_2px_0_0_var(--accent)]")}>
                <span className="sl-num w-11 flex-none select-none pr-3.5 text-right text-12 leading-[22px] text-faint">{i + 1}</span>
                <span className="sl-num whitespace-pre pr-5 text-13 leading-[22px]">
                  {tokenize(line, snip.lang).map((t, k) => (
                    <span key={k} style={{ color: t.c }}>
                      {t.v}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
        <div className="border-t border-hairline px-4 py-3 text-12 leading-normal text-faint">{snip.note}</div>
      </div>
    </div>
  );
}
