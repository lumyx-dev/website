import * as React from "react";
import { cx } from "@/lib/cx";
import { DOT, INK } from "@/lib/tone";
import type { Tone } from "@/lib/home-data";

/** Hero product window: one incident, with a packet-loss trace that keeps moving. Demo data. */

const N = 40;
const SEED = Array.from({ length: N }, (_, i) => 0.7 + 0.4 * Math.abs(Math.sin(i * 0.8)));
const lossAt = (t: number) => {
  const s = (Math.sin(t / 8) + 1) / 2;
  return 1 + 7 * s + 0.6 * Math.sin(t * 1.9);
};

function useLoss() {
  const [loss, setLoss] = React.useState(SEED);
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = 0;
    const iv = setInterval(() => {
      t += 1;
      setLoss((l) => [...l.slice(1), lossAt(t)]);
    }, 600);
    return () => clearInterval(iv);
  }, []);
  return loss;
}

const RAIL = [
  "M40 72h176M40 128h176M40 184h176",
  "M128 32v192M32 128h192",
  "M48 208V96M128 208V48M208 208v-80",
  "M128 40a88 88 0 1 0 0 176a88 88 0 1 0 0-176M128 88v40l24 24",
  "M72 104l56 56 56-56",
];

const INCIDENTS: { t: string; m: string; tone: Tone; on?: boolean }[] = [
  { t: "Amara froze", m: "webinar-us · 2.4s · now", tone: "bad", on: true },
  { t: "Kenji high jitter", m: "webinar-us · 41 ms · 6 min ago", tone: "warn" },
  { t: "TURN fallback", m: "standup-eu · 1 peer · 18 min ago", tone: "warn" },
  { t: "Ravi reconnected", m: "standup-eu · resolved", tone: "ok" },
];

const ACTIVITY: { t: string; at: string; d: string; tone: Tone; code?: string }[] = [
  { t: "ICE fell back to TURN", at: "14:06:02", d: "Direct path failed. Packets now take the relay.", tone: "warn" },
  { t: "Packet loss above 2%", at: "14:06:29", d: "Sustained for 12s on the video track.", tone: "bad", code: "packet_loss_ratio = 0.079" },
  { t: "Freeze detected", at: "14:06:41", d: "Five peers stopped receiving frames from Amara.", tone: "bad", code: "freeze_ratio = 0.18" },
  { t: "Keyframe requested", at: "14:06:43", d: "PLI sent to Amara to recover the stream.", tone: "accent" },
];

const PEERS = ["A", "L", "N", "K", "I", "R"];

export function IncidentWindow() {
  const loss = useLoss();
  const cur = loss[loss.length - 1];
  const rtt = Math.round(130 + cur * 18);
  const path = loss
    .map((v, i) => `${i ? "L" : "M"}${((i * 400) / (N - 1)).toFixed(1)} ${(54 - Math.min(1, v / 9) * 52).toFixed(1)}`)
    .join(" ");

  const props: { k: string; v: string; tone?: Tone }[] = [
    { k: "Room", v: "webinar-us · eu-west-3" },
    { k: "Peer", v: "Amara · ff104b2c" },
    { k: "Path", v: "TURN relay", tone: "bad" },
    { k: "Packet loss", v: `${cur.toFixed(1)}% vs 2%`, tone: cur > 2 ? "bad" : "ok" },
    { k: "Round trip", v: `${rtt} ms vs 200`, tone: rtt > 200 ? "bad" : undefined },
    { k: "Impacted peers", v: "5 of 6" },
  ];

  return (
    <div className="relative rounded-xl border border-stroke bg-card/60 p-2 shadow-lg">
      <div className="grid overflow-hidden rounded-lg border border-stroke bg-card min-[960px]:min-h-[560px] min-[960px]:grid-cols-[56px_240px_minmax(0,1fr)]">
        {/* icon rail */}
        <div className="hidden flex-col items-center gap-3 border-r border-hairline bg-sunken py-4 min-[960px]:flex" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 48 48" className="fill-accent">
            <path d="M24 4L41.3 14L31.5 24Z" />
            <path d="M41.3 34L24 44L20.3 30.5Z" />
            <path d="M6.7 34L6.7 14L20.2 17.5Z" />
          </svg>
          {RAIL.map((d, i) => (
            <span key={d} className={cx("flex size-8 items-center justify-center rounded-xs", i === 3 && "bg-accent-tint")}>
              <svg width="16" height="16" viewBox="0 0 256 256" fill="none" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" className={i === 3 ? "stroke-accent" : "stroke-faint"}>
                <path d={d} />
              </svg>
            </span>
          ))}
        </div>

        {/* incident list */}
        <div className="hidden flex-col border-r border-hairline min-[960px]:flex">
          <div className="flex items-center justify-between p-4 text-14 font-semibold text-strong">
            Incidents<span className="sl-num text-12 font-normal text-faint">webinar-us</span>
          </div>
          {INCIDENTS.map((ic) => (
            <div key={ic.t} className={cx("mx-2 mb-1 flex flex-col gap-1 rounded-sm p-3", ic.on && "bg-inset")}>
              <span className="flex items-center gap-2 text-14 font-semibold text-strong">
                <span className={cx("size-2 rounded-pill", DOT[ic.tone])} />
                {ic.t}
              </span>
              <span className="text-12 text-faint">{ic.m}</span>
            </div>
          ))}
        </div>

        {/* detail */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-3 border-b border-hairline px-6 py-4 text-14">
            <span className="sl-num text-faint">#42</span>
            <span className="font-semibold text-strong">Amara’s video froze</span>
            <span className="rounded-pill bg-danger-tint px-2 py-0.5 text-12 font-semibold text-danger">Open</span>
            <span className="flex-1" />
            <span className="hidden pl-2 min-[960px]:flex" aria-hidden="true">
              {PEERS.map((p, k) => (
                <span
                  key={p}
                  className={cx(
                    "-ml-2 flex size-6 items-center justify-center rounded-pill border-2 border-card text-12 font-semibold",
                    k === 0 ? "bg-danger-tint text-danger" : "bg-accent-tint text-accent-text",
                  )}
                >
                  {p}
                </span>
              ))}
            </span>
          </div>

          <div className="grid flex-1 min-[640px]:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 min-[640px]:border-r min-[640px]:border-hairline">
              <span className="flex size-12 items-center justify-center rounded-sm bg-danger-tint" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 256 256" fill="none" strokeWidth="18" strokeLinecap="round" className="stroke-danger-solid">
                  <path d="M128 24v208M38 76l180 104M38 180L218 76" />
                </svg>
              </span>
              <div>
                <h3 className="m-0 text-[24px] leading-8 tracking-[-0.02em] text-strong">Amara’s video froze</h3>
                <p className="m-0 mt-1 text-14 leading-5 text-muted">Six peers saw her tile stop for 2.4s while audio kept going.</p>
              </div>
              <dl className="m-0 flex flex-col">
                {props.map((p) => (
                  <div key={p.k} className="grid grid-cols-[120px_minmax(0,1fr)] gap-2 py-2 text-14 leading-5">
                    <dt className="text-faint">{p.k}</dt>
                    <dd className={cx("sl-num m-0 font-medium", p.tone ? INK[p.tone] : "text-strong")}>{p.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto flex flex-col gap-2 rounded-sm border border-hairline bg-sunken px-4 py-3">
                <span className="flex justify-between text-12 text-faint">
                  <span>Packet loss · last 30s</span>
                  <span className="sl-num text-danger">{cur.toFixed(1)}%</span>
                </span>
                <svg viewBox="0 0 400 56" preserveAspectRatio="none" className="block h-14 w-full" aria-hidden="true">
                  <line x1="0" x2="400" y1="44" y2="44" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" className="stroke-stroke" />
                  <path d={path} fill="none" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="stroke-danger-solid" />
                </svg>
              </div>
            </div>

            <div className="hidden flex-col gap-1 bg-sunken p-6 min-[640px]:flex">
              <div className="mb-3 flex gap-1 text-12" aria-hidden="true">
                <span className="rounded-xs border border-stroke bg-card px-3 py-1 font-semibold text-strong">Activity</span>
                <span className="px-3 py-1 text-faint">Peers</span>
                <span className="px-3 py-1 text-faint">Metrics</span>
              </div>
              <ol className="m-0 list-none p-0">
                {ACTIVITY.map((a, i) => (
                  <li key={a.t} className="grid grid-cols-[16px_minmax(0,1fr)] gap-3">
                    <span className="flex flex-col items-center">
                      <span className={cx("mt-1.5 size-2 rounded-pill", DOT[a.tone])} />
                      {i < ACTIVITY.length - 1 && <span className="w-px flex-1 bg-stroke" />}
                    </span>
                    <div className="flex flex-col gap-1 pb-4">
                      <span className="text-14 leading-5">
                        <span className="font-semibold text-strong">{a.t}</span> <span className="sl-num text-12 text-faint">{a.at}</span>
                      </span>
                      <span className="text-14 leading-5 text-muted">{a.d}</span>
                      {a.code && (
                        <span className="sl-num mt-1 rounded-xs border border-stroke bg-card px-3 py-2 text-12 text-accent-text">{a.code}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
