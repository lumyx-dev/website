import { useSyncExternalStore } from "react";

/**
 * Simulated room shared by the hero console and the topology section. Both islands read the
 * same store, so a peer degrading in the table degrades on the graph at the same tick.
 * The metric names and thresholds are real; the sampled values are invented (demo data).
 */

export const HISTORY = 60;
export const TICK_MS = 500;

export type Ice = "host" | "srflx" | "relay";

type BasePeer = {
  id: string;
  /** Position on the 1000×520 topology canvas. */
  x: number;
  y: number;
  /** Nominal bitrate, kbps. */
  br: number;
  ice: Ice;
  /** Edge from the SFU (500,260) to the peer, in canvas coordinates. */
  path: string;
  /** How much the peer drifts (0 = steady), and its phase. */
  amp: number;
  ph: number;
  rtt: number;
  loss: number;
  jit: number;
};

export const PEERS: BasePeer[] = [
  { id: "ff104b2c", x: 150, y: 110, br: 380, ice: "relay", path: "M500 260 L320 150 L150 110", amp: 1, ph: 0, rtt: 284, loss: 7.9, jit: 42 },
  { id: "a3f91c02", x: 180, y: 410, br: 2400, ice: "host", path: "M500 260 L180 410", amp: 0, ph: 0, rtt: 38, loss: 0.2, jit: 4 },
  { id: "c27ad930", x: 820, y: 120, br: 1600, ice: "srflx", path: "M500 260 L820 120", amp: 0.7, ph: Math.PI, rtt: 71, loss: 0.6, jit: 9 },
  { id: "7e01d4aa", x: 860, y: 300, br: 2100, ice: "host", path: "M500 260 L860 300", amp: 0, ph: 0, rtt: 52, loss: 0.3, jit: 6 },
  { id: "5b9c3e10", x: 720, y: 450, br: 900, ice: "srflx", path: "M500 260 L720 450", amp: 0.45, ph: Math.PI / 2, rtt: 118, loss: 1.4, jit: 18 },
  { id: "91da0f67", x: 380, y: 460, br: 2600, ice: "host", path: "M500 260 L380 460", amp: 0, ph: 0, rtt: 44, loss: 0.1, jit: 5 },
];

export type PeerSample = { id: string; rtt: number; loss: number; jit: number; br: number; score: number };

const noise = (v: number, k: number) => v * (1 + (Math.random() - 0.5) * k);

function sample(t: number, still: boolean): PeerSample[] {
  const n = still ? 0 : 1;
  return PEERS.map((b) => {
    let rtt: number, loss: number, jit: number;
    if (b.ice === "relay") {
      const s = still ? 1 : (Math.sin(t / 12) + 1) / 2;
      rtt = 130 + 160 * s;
      loss = 0.8 + 7.4 * s;
      jit = 14 + 30 * s;
    } else {
      const bad = b.amp && !still ? (b.amp * (Math.sin(t / 12 + b.ph) + 1)) / 2 : 0;
      rtt = b.rtt + 200 * bad;
      loss = b.loss + 5 * bad;
      jit = b.jit + 26 * bad;
    }
    const r = noise(rtt, 0.08 * n);
    const l = Math.max(0.05, noise(loss, 0.18 * n));
    const j = noise(jit, 0.15 * n);
    const br = noise(b.br * (1 - Math.min(0.5, l / 20)), 0.06 * n);
    const score = Math.max(4, Math.min(99, Math.round(100 - l * 6 - Math.max(0, r - 80) / 4 - Math.max(0, j - 10) / 1.5)));
    return { id: b.id, rtt: r, loss: l, jit: j, br, score };
  });
}

const avg = (s: PeerSample[], k: "jit" | "loss") => s.reduce((a, p) => a + p[k], 0) / s.length;

export type RoomSnapshot = {
  t: number;
  peers: PeerSample[];
  /** Room-average series, oldest first. */
  jit: number[];
  loss: number[];
  /** False on the server, before mount, and under prefers-reduced-motion. */
  live: boolean;
};

function history(still: boolean): Pick<RoomSnapshot, "jit" | "loss"> {
  const jit: number[] = [];
  const loss: number[] = [];
  for (let i = -HISTORY; i < 0; i++) {
    const s = sample(i, still);
    jit.push(avg(s, "jit"));
    loss.push(avg(s, "loss"));
  }
  return { jit, loss };
}

/** Deterministic: identical on the server and at hydration. */
const STILL: RoomSnapshot = { t: 0, peers: sample(0, true), ...history(true), live: false };

let snapshot = STILL;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

const emit = () => listeners.forEach((l) => l());

function tick() {
  const t = snapshot.t + 1;
  const peers = sample(t, false);
  snapshot = {
    t,
    peers,
    jit: [...snapshot.jit.slice(1), avg(peers, "jit")],
    loss: [...snapshot.loss.slice(1), avg(peers, "loss")],
    live: true,
  };
  emit();
}

function start() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  if (!snapshot.live) {
    snapshot = { t: 0, peers: sample(0, false), ...history(false), live: true };
    emit();
  }
  timer = setInterval(tick, TICK_MS);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) start();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

export function useRoom(): RoomSnapshot {
  return useSyncExternalStore(subscribe, () => snapshot, () => STILL);
}

/* ── Presentation helpers ─────────────────────────────────────────────── */

export type Status = "ok" | "warn" | "bad";

export const statusOf = (p: PeerSample): Status => (p.score < 60 ? "bad" : p.score < 80 ? "warn" : "ok");

export const STATUS_TEXT: Record<Status, string> = { ok: "var(--ok)", warn: "var(--warn)", bad: "var(--danger)" };
export const STATUS_SOLID: Record<Status, string> = { ok: "var(--ok-solid)", warn: "var(--warn-solid)", bad: "var(--danger-solid)" };

/** Colour of a value against its warning and breach thresholds. */
export const severity = (v: number, warn: number, breach: number) =>
  v > breach ? "var(--danger)" : v > warn ? "var(--warn)" : "var(--text-body)";

/** SVG path for a series on a 760×120 chart. */
export const linePath = (vals: number[], max: number) =>
  vals
    .map((v, i) => `${i ? "L" : "M"}${((i * 760) / (HISTORY - 1)).toFixed(1)} ${(116 - Math.min(1, v / max) * 108).toFixed(1)}`)
    .join(" ");
