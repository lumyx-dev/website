/**
 * Content of the home page (design: "Lumyx Home v3", Claude Design).
 * Every "works today" claim mirrors the Project status table of the sfu-core README —
 * keep the two in step. Room, peer and incident figures are demo data and are labelled as such.
 */
import { DOCS_URL, REPO } from "./site-data";

export const DOCKER_RUN = "docker run -p 3000:3000 ghcr.io/lumyx-dev/sfu-core:latest";
export const QUICKSTART = `${DOCS_URL}/quickstart`;

export const NAV = [
  { href: "/#top", label: "Overview" },
  { href: "/#product", label: "Product" },
  { href: "/#status", label: "Status" },
  { href: "/#start", label: "Quickstart" },
  { href: "/#faq", label: "FAQ" },
  { href: DOCS_URL, label: "Docs" },
];

export const STACK = ["Rust", "WebRTC", "RTCP", "WebSocket", "Docker", "MIT"];

/** The scroll-lit statement. `true` marks a highlighted phrase; plain runs are split per word. */
export const STATEMENT: [string, boolean][] = [
  ["Lumyx forwards", false],
  ["every packet,", true],
  ["reads", false],
  ["every RTCP report,", true],
  ["and tells", false],
  ["you which peer broke", true],
  ["and why. No exporter, no Grafana, no guessing.", false],
];

export type Tone = "ok" | "warn" | "bad" | "accent" | "idle";

export type Pillar = {
  title: string;
  body: string;
  planned: boolean;
  ui: { t: string; v: string; tone: Tone; flagged?: boolean }[];
};

/** Detect and explain need the RTCP metrics collector, which the README lists as planned. */
export const PILLARS: Pillar[] = [
  {
    title: "Detect",
    body: "Freezes, loss spikes and TURN fallbacks show up the moment the forwarder sees them, before a user writes in.",
    planned: true,
    ui: [
      { t: "Amara", v: "frozen", tone: "bad", flagged: true },
      { t: "Kenji", v: "live", tone: "ok" },
      { t: "Noor", v: "live", tone: "ok" },
    ],
  },
  {
    title: "Explain",
    body: "Six numbers per peer, compared to your thresholds, so the cause is written next to the symptom.",
    planned: true,
    ui: [
      { t: "packet loss", v: "7.9% / 2%", tone: "bad" },
      { t: "jitter", v: "44 ms / 30", tone: "bad" },
      { t: "round trip", v: "212 / 250", tone: "ok" },
    ],
  },
  {
    title: "Recover",
    body: "Request a keyframe, drop a simulcast layer or fall back to audio, and log what it did.",
    planned: true,
    ui: [
      { t: "PLI sent", v: "14:06:43", tone: "accent" },
      { t: "Layer 720p → 360p", v: "planned", tone: "idle" },
      { t: "Audio only", v: "planned", tone: "idle" },
    ],
  },
];

export const TABS = [
  { label: "Rooms", desc: "Every live room and its worst peer" },
  { label: "Peers", desc: "Six numbers per participant" },
  { label: "Topology", desc: "The path each packet takes" },
  { label: "Config", desc: "Thresholds in one TOML file" },
] as const;

export const ROOMS: { n: string; p: number; l: string; r: string; s: "Healthy" | "Watch" | "Degraded" }[] = [
  { n: "webinar-us", p: 6, l: "7.9%", r: "284 ms", s: "Degraded" },
  { n: "standup-eu", p: 4, l: "0.4%", r: "61 ms", s: "Healthy" },
  { n: "support-call-1187", p: 2, l: "0.1%", r: "38 ms", s: "Healthy" },
  { n: "demo-room", p: 9, l: "1.6%", r: "173 ms", s: "Watch" },
  { n: "design-review", p: 3, l: "0.3%", r: "52 ms", s: "Healthy" },
  { n: "all-hands", p: 14, l: "0.7%", r: "88 ms", s: "Healthy" },
];

export const PEER_CARDS: { n: string; l: string; r: string; j: string; b: string; tone: Tone }[] = [
  { n: "Amara", l: "7.9%", r: "284 ms", j: "44 ms", b: "0.2 Mbps", tone: "bad" },
  { n: "Léo", l: "0.6%", r: "71 ms", j: "9 ms", b: "1.6 Mbps", tone: "ok" },
  { n: "Noor", l: "0.3%", r: "52 ms", j: "6 ms", b: "2.1 Mbps", tone: "ok" },
  { n: "Kenji", l: "1.4%", r: "118 ms", j: "41 ms", b: "0.9 Mbps", tone: "warn" },
  { n: "Inès", l: "0.1%", r: "44 ms", j: "5 ms", b: "2.6 Mbps", tone: "ok" },
  { n: "Ravi", l: "0.2%", r: "38 ms", j: "4 ms", b: "2.4 Mbps", tone: "ok" },
];

export const TOPO: { id: string; x: number; y: number; w: number; relay?: boolean; tone: Tone; labelBelow: boolean }[] = [
  { id: "ff104b2c", x: 110, y: 80, w: 2, relay: true, tone: "bad", labelBelow: true },
  { id: "a3f91c02", x: 120, y: 330, w: 6, tone: "ok", labelBelow: false },
  { id: "c27ad930", x: 690, y: 80, w: 4, tone: "ok", labelBelow: true },
  { id: "7e01d4aa", x: 720, y: 240, w: 5, tone: "ok", labelBelow: true },
  { id: "5b9c3e10", x: 610, y: 370, w: 3, tone: "warn", labelBelow: false },
  { id: "91da0f67", x: 330, y: 380, w: 6, tone: "ok", labelBelow: false },
];

/** Draft config shape — today the SFU reads environment variables. */
export const TOML = [
  "# lumyx.toml",
  "[server]",
  'listen = "0.0.0.0:3000"',
  'region = "eu-west-3"',
  "",
  "[thresholds]",
  "packet_loss_ratio = 0.02",
  "rtt_ms = 200",
  "jitter_ms = 30",
  "freeze_ratio = 0.01",
  'debounce = "30s"',
];

/** `true` = ships in the current alpha, `false` = planned. Mirrors the README. */
export const CHECKS: { t: string; items: [string, boolean][] }[] = [
  {
    t: "Media",
    items: [["Selective forwarding", true], ["ICE, DTLS, SRTP", true], ["RTP forwarding", true], ["Simulcast layers", false], ["TURN fallback", false]],
  },
  {
    t: "Observability",
    items: [["RTCP metrics collector", false], ["Six metrics per peer", false], ["Room topology", false], ["Prometheus endpoint", false], ["Session replay", false]],
  },
  {
    t: "Operations",
    items: [["Single process", true], ["Docker image", true], ["WebSocket signaling", true], ["Room manager", true], ["Alerts to Slack and PagerDuty", false]],
  },
];

export const FACTS = [
  { v: "Rust", k: "end to end in the media path" },
  { v: "0", k: "garbage collector pauses" },
  { v: "1", k: "process to deploy" },
  { v: "MIT", k: "licensed, no account needed" },
];

export const QS_STEPS = ["Run the container", "Open a WebSocket and join a room", "Forward media between peers"];

export type StartLine = { p: string; v: string; dim?: boolean };

export const START: Record<"docker" | "cargo", { label: string; lines: StartLine[] }> = {
  docker: {
    label: "docker",
    lines: [
      { p: "$", v: DOCKER_RUN },
      { p: "#", v: "then open http://localhost:3000", dim: true },
    ],
  },
  cargo: {
    label: "cargo",
    lines: [
      { p: "$", v: "git clone https://github.com/lumyx-dev/sfu-core && cd sfu-core" },
      { p: "$", v: "mkcert -install && mkcert localhost 127.0.0.1" },
      { p: "$", v: "cargo run --release" },
      { p: "#", v: "then open https://localhost:3000", dim: true },
    ],
  },
};

export type StartKey = keyof typeof START;

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Is Lumyx ready for production?",
    a: "Not yet. It is an alpha: ICE, DTLS, SRTP and selective RTP forwarding work end to end. Quality metrics, alerting, the dashboard and simulcast are on the roadmap.",
  },
  {
    q: "Do I need an SDK?",
    a: "No. Clients speak plain JSON over a WebSocket and use the browser’s RTCPeerConnection. There is nothing to install.",
  },
  {
    q: "Which metrics will it collect?",
    a: "Packet loss ratio, jitter, round trip time, NACK ratio, freeze ratio and bitrate, per peer and per room, every 500 ms. The collector is planned.",
  },
  {
    q: "Where does call data go?",
    a: "Nowhere. Lumyx runs on your server and keeps room state in process. Nothing is sent to us.",
  },
  { q: "What does it cost?", a: "Nothing. The code is MIT licensed and runs on your own server." },
  {
    q: "How can I help?",
    a: "Run it against your own calls and tell us what broke or what is missing. Issues and pull requests are welcome.",
  },
];

/** Every entry resolves to a page that exists. */
export const FOOTER_COLS = [
  {
    t: "Product",
    links: [
      { label: "Overview", href: "/#top" },
      { label: "Project status", href: "/#status" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    t: "Developers",
    links: [
      { label: "Quickstart", href: QUICKSTART },
      { label: "Docs", href: DOCS_URL },
      { label: "Metrics reference", href: `${DOCS_URL}/metrics-reference` },
      { label: "Configuration", href: `${DOCS_URL}/config` },
    ],
  },
  {
    t: "Open source",
    links: [
      { label: "GitHub", href: REPO },
      { label: "License", href: `${REPO}/blob/main/LICENSE` },
      { label: "Contributing", href: `${REPO}/blob/main/CONTRIBUTING.md` },
      { label: "Discussions", href: `${REPO}/discussions` },
    ],
  },
];
