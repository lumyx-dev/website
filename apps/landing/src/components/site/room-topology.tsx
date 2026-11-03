import * as React from "react";
import { cx } from "@/lib/cx";
import { PEERS, STATUS_SOLID, STATUS_TEXT, severity, statusOf, useRoom } from "@/lib/peer-sim";

/* The canvas is drawn in a 1000×520 coordinate space. The SVG scales through its viewBox;
   the HTML nodes sit on the same grid through percentages, so both stay aligned. */
const W = 1000;
const H = 520;
const SFU = { x: 500, y: 260 };
const TURN = { x: 320, y: 150 };
const pct = (x: number, y: number) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

/** Edge width encodes the peer's nominal bitrate. */
const EDGE_WIDTH: Record<string, number> = {
  a3f91c02: 5.6, c27ad930: 4.1, "7e01d4aa": 5, "5b9c3e10": 2.7, "91da0f67": 6,
};

export function RoomTopology() {
  const room = useRoom();
  const [selected, setSelected] = React.useState("ff104b2c");
  const byId = Object.fromEntries(room.peers.map((p) => [p.id, p]));

  const base = PEERS.find((b) => b.id === selected) ?? PEERS[0];
  const sp = byId[base.id];
  const sst = statusOf(sp);
  const relay = base.ice === "relay";
  const details = [
    { k: "path", v: relay ? "TURN relay" : "direct", c: relay ? STATUS_TEXT.bad : "var(--text-strong)" },
    { k: "ice_candidate_type", v: base.ice, c: "var(--text-strong)" },
    { k: "rtt_ms", v: Math.round(sp.rtt), c: severity(sp.rtt, 150, 200) },
    { k: "packet_loss_ratio", v: (sp.loss / 100).toFixed(3), c: severity(sp.loss, 1, 2) },
    { k: "jitter_ms", v: Math.round(sp.jit), c: severity(sp.jit, 20, 30) },
    { k: "bitrate_kbps", v: Math.round(sp.br).toLocaleString("en-US"), c: "var(--text-strong)" },
    { k: "score", v: sp.score, c: STATUS_TEXT[sst] },
  ];
  const note = relay
    ? "Fell back to a TURN relay after ICE failed on the direct path. Every packet takes the long way."
    : sst === "ok"
      ? "Direct path, within every threshold."
      : "Direct path, drifting toward a threshold.";

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-xs border border-stroke bg-card min-[1180px]:grid-cols-[minmax(0,1fr)_320px]">
      <div className="sl-scroll min-w-0 overflow-x-auto overflow-y-hidden bg-sunken">
        <div className="relative aspect-[1000/520] min-w-[600px]">
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 block size-full" aria-hidden>
            {PEERS.filter((b) => b.ice !== "relay").map((b) => (
              <path
                key={b.id}
                d={b.path}
                stroke="var(--text-faint)"
                strokeWidth={EDGE_WIDTH[b.id]}
                opacity="0.55"
                fill="none"
                strokeLinecap="round"
              />
            ))}
            {PEERS.filter((b) => b.ice === "relay").map((b) => (
              <path
                key={b.id}
                d={b.path}
                stroke="var(--danger-solid)"
                strokeWidth="1.8"
                strokeDasharray="6 6"
                fill="none"
                strokeLinejoin="round"
              />
            ))}
            {/* Travelling pulses: what the SFU is forwarding right now. Their speed follows the
                peer's RTT. Rendered only once live, so reduced motion gets a still graph. */}
            {room.live &&
              PEERS.flatMap((b) => {
                const dur = 0.9 + b.rtt / 110;
                return [0, 0.5].map((o) => (
                  <circle key={`${b.id}-${o}`} r="3.5" fill={b.ice === "relay" ? "var(--danger-solid)" : "var(--accent)"}>
                    <animateMotion dur={`${dur.toFixed(2)}s`} begin={`-${(dur * o).toFixed(2)}s`} repeatCount="indefinite" path={b.path} />
                  </circle>
                ));
              })}
          </svg>

          <div
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-xs border border-accent-border bg-card px-[1.2em] py-[0.7em] shadow-[0_0_0_6px_var(--surface-sunken)]"
            style={pct(SFU.x, SFU.y)}
          >
            <span className="sl-num text-13 font-medium text-strong">sfu-core</span>
            <span className="sl-num whitespace-nowrap text-11 text-faint">eu-west-3</span>
          </div>

          <div
            className="sl-num absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[6px] border border-dashed border-danger-solid bg-card px-[0.9em] py-[0.5em] text-11 text-danger"
            style={pct(TURN.x, TURN.y)}
          >
            turn · relay
          </div>

          {PEERS.map((b) => {
            const p = byId[b.id];
            const st = statusOf(p);
            const isSel = b.id === selected;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelected(b.id)}
                aria-pressed={isSel}
                aria-label={`Inspect peer ${b.id}`}
                className="absolute -ml-[70px] -mt-[22px] flex w-[140px] cursor-pointer flex-col items-center gap-2 border-0 bg-transparent p-0"
                style={pct(b.x, b.y)}
              >
                <span
                  className="flex size-11 items-center justify-center rounded-pill border-2 bg-card transition-shadow"
                  style={{
                    borderColor: STATUS_SOLID[st],
                    boxShadow: isSel ? "0 0 0 5px var(--accent-tint), 0 0 0 6px var(--accent)" : "none",
                  }}
                >
                  <span className="size-2 rounded-pill" style={{ background: STATUS_SOLID[st] }} />
                </span>
                <span className="flex flex-col items-center gap-px rounded-[4px] bg-sunken px-1.5 py-0.5">
                  <span className="sl-num text-12 text-strong">{b.id}</span>
                  <span className="sl-num text-11" style={{ color: st === "ok" ? "var(--text-faint)" : STATUS_TEXT[st] }}>
                    {Math.round(p.rtt)}ms · {(p.br / 1000).toFixed(1)}M
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="flex flex-col border-t border-hairline min-[1180px]:border-l min-[1180px]:border-t-0">
        <div className="flex flex-col gap-1.5 border-b border-hairline px-5 pb-4 pt-5">
          <span className="sl-label">Selected peer</span>
          <span className="flex items-center gap-2.5">
            <span className="size-2 rounded-pill" style={{ background: STATUS_SOLID[sst] }} />
            <span className="sl-num text-20 font-medium text-strong">{base.id}</span>
          </span>
          <span className="text-13 leading-normal text-muted text-pretty">{note}</span>
        </div>
        {details.map((d) => (
          <div key={d.k} className="sl-num flex justify-between gap-3 border-b border-subtle px-5 py-2.5 text-13">
            <span className="text-muted">{d.k}</span>
            <span style={{ color: d.c }}>{d.v}</span>
          </div>
        ))}
        <span className={cx("px-5 py-3.5 text-12 text-faint")}>Click a node to inspect it. Demo data.</span>
      </aside>
    </div>
  );
}
