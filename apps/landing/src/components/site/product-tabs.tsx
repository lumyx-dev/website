import * as React from "react";
import { cx } from "@/lib/cx";
import { DOT, FILL, INK, STROKE } from "@/lib/tone";
import { PEER_CARDS, ROOMS, TABS, TOML, TOPO, type Tone } from "@/lib/home-data";

/** "Inside the forwarder": four views of one deployment, behind a vertical tab list. Demo data. */

const STATUS_TONE: Record<(typeof ROOMS)[number]["s"], Tone> = { Healthy: "ok", Watch: "warn", Degraded: "bad" };
const PILL: Record<Tone, string> = {
  ok: "bg-ok-tint text-ok",
  warn: "bg-warn-tint text-warn",
  bad: "bg-danger-tint text-danger",
  accent: "bg-accent-tint text-accent-text",
  idle: "bg-idle-tint text-idle",
};
const lossTone = (l: string): Tone => (parseFloat(l) > 2 ? "bad" : parseFloat(l) > 1 ? "warn" : "ok");

function Rooms() {
  const cols = "grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center px-6 py-4";
  return (
    <div className="sl-scroll overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className={cx(cols, "border-b border-hairline text-12 text-faint")}>
            {["room", "peers", "loss", "rtt", "status"].map((h) => (
              <th key={h} scope="col" className="p-0 font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROOMS.map((r) => (
            <tr key={r.n} className={cx(cols, "border-b border-subtle text-14")}>
              <td className="sl-num p-0 font-medium text-strong">{r.n}</td>
              <td className="sl-num p-0 text-body">{r.p}</td>
              <td className={cx("sl-num p-0", INK[lossTone(r.l)])}>{r.l}</td>
              <td className="sl-num p-0 text-body">{r.r}</td>
              <td className="p-0">
                <span className={cx("rounded-pill px-2 py-0.5 text-12 font-semibold", PILL[STATUS_TONE[r.s]])}>{r.s}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Peers() {
  return (
    <div className="grid gap-2 p-4 min-[640px]:grid-cols-3">
      {PEER_CARDS.map((p) => (
        <div key={p.n} className={cx("flex flex-col gap-3 rounded-sm border p-4", p.tone === "bad" ? "border-danger-solid/40" : "border-stroke")}>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-pill bg-accent-tint text-14 font-semibold text-accent-text">{p.n[0]}</span>
            <span className="text-14 font-semibold text-strong">{p.n}</span>
            <span className="flex-1" />
            <span className={cx("size-2 rounded-pill", DOT[p.tone])} />
          </div>
          <div className="sl-num grid grid-cols-2 gap-1 text-12 text-muted">
            <span>loss {p.l}</span>
            <span>rtt {p.r}</span>
            <span>jitter {p.j}</span>
            <span>{p.b}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Topology() {
  return (
    <svg viewBox="0 0 800 420" className="block h-auto w-full" role="img" aria-label="Six peers connected to sfu-core. One peer, ff104b2c, goes through a TURN relay and is failing.">
      {TOPO.map((t) =>
        t.relay ? (
          <path key={t.id} d={`M400 210 L228 144 L${t.x} ${t.y}`} fill="none" strokeWidth={t.w} strokeDasharray="6 6" strokeLinecap="round" className={STROKE.bad} />
        ) : (
          <path key={t.id} d={`M400 210 L${t.x} ${t.y}`} fill="none" strokeWidth={t.w} strokeLinecap="round" className="stroke-stroke" />
        ),
      )}
      {TOPO.map((t) => (
        <g key={t.id}>
          <circle cx={t.x} cy={t.y} r="22" strokeWidth="3" className={cx("fill-card", STROKE[t.tone])} />
          <circle cx={t.x} cy={t.y} r="5" className={FILL[t.tone]} />
          <text x={t.x} y={t.labelBelow ? t.y + 44 : t.y - 34} textAnchor="middle" fontSize="13" className="sl-num fill-muted">
            {t.id}
          </text>
        </g>
      ))}
      <rect x="340" y="180" width="120" height="60" rx="12" className="fill-strong" />
      <text x="400" y="216" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-page">sfu-core</text>
      <rect x="180" y="128" width="96" height="32" rx="8" strokeDasharray="4 4" className={cx("fill-card", STROKE.bad)} />
      <text x="228" y="149" textAnchor="middle" fontSize="12" className="fill-danger">turn relay</text>
    </svg>
  );
}

function Config() {
  return (
    <div className="sl-num sl-scroll overflow-x-auto whitespace-pre p-6 text-14 leading-6">
      {TOML.map((l, i) => (
        <div key={i} className={l.startsWith("#") ? "text-faint" : l.startsWith("[") ? "text-accent-text" : "text-strong"}>
          {l || " "}
        </div>
      ))}
    </div>
  );
}

const PANELS = [Rooms, Peers, Topology, Config];

export function ProductTabs() {
  const [tab, setTab] = React.useState(0);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const Panel = PANELS[tab];

  const onKey = (e: React.KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (tab + step + TABS.length) % TABS.length;
    setTab(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="grid items-start gap-6 min-[960px]:grid-cols-[280px_minmax(0,1fr)]">
      <div role="tablist" aria-label="Product views" aria-orientation="vertical" className="sl-scroll flex gap-1 overflow-x-auto min-[960px]:flex-col">
        {TABS.map((t, i) => {
          const on = tab === i;
          return (
            <button
              key={t.label}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`ptab-${i}`}
              aria-selected={on}
              aria-controls="ptab-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setTab(i)}
              onKeyDown={onKey}
              className={cx(
                "flex min-w-max cursor-pointer flex-col gap-1 rounded-lg border p-4 text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] min-[960px]:min-w-0",
                on ? "border-stroke bg-card" : "border-transparent bg-transparent hover:bg-hover",
              )}
            >
              <span className={cx("text-16 font-semibold", on ? "text-strong" : "text-muted")}>{t.label}</span>
              <span className="hidden text-14 text-faint min-[960px]:block">{t.desc}</span>
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id="ptab-panel" aria-labelledby={`ptab-${tab}`} className="min-h-[440px] rounded-xl border border-stroke bg-sunken p-2">
        <div className="min-h-[422px] overflow-hidden rounded-lg border border-stroke bg-card">
          <Panel />
        </div>
      </div>
    </div>
  );
}
