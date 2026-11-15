/**
 * Content of the v2 exploration (/v2). Every "works today" fact mirrors the Project status table
 * and the Quick start of the sfu-core README; keep the two in step. Incident figures are demo data.
 */
import type { StartLine } from "./home-data";
import { DOCS_URL, REPO } from "./site-data";

export const V2_VERSION = "0.1.0";
export const LICENSE = "AGPL-3.0";
export const SELF_HOSTED = "https://github.com/lumyx-dev/self-hosted";
export const README_QUICKSTART = `${REPO}#quick-start`;

export const V2_NAV = [
  { href: "/v2#today", label: "Today" },
  { href: "/v2#next", label: "Roadmap" },
  { href: "/v2#start", label: "Quickstart" },
  { href: "/v2#faq", label: "FAQ" },
  { href: DOCS_URL, label: "Docs" },
];

/** First-screen facts: the hard ones, from the README. */
export const HERO_FACTS = [`Alpha ${V2_VERSION}`, "~3 µs per packet at 50 peers", LICENSE];

/** Measured or shipped today. */
export const TODAY_FACTS = [
  { v: "~3 µs", k: "to route one packet, 50 peers in the room" },
  { v: "148", k: "tests, routing covered without a network" },
  { v: "1", k: "process for signaling and forwarding" },
  { v: "0", k: "SDKs: JSON over a WebSocket" },
];

export const TODAY_LIST = [
  "ICE, DTLS and SRTP through str0m",
  "Selective RTP forwarding, audio and video",
  "Keyframe requests routed back to the publisher",
  "Per-peer drop counters on /metrics",
];

/** Excerpt of the real /metrics answer (README). */
export const METRICS_JSON: [string, string][] = [
  ['"rooms"', "1"],
  ['"peers"', "2"],
  ['"rtp_packets_forwarded"', "48210"],
  ['"bytes_forwarded"', "31877342"],
  ['"keyframe_requests"', "12"],
  ['"peers_connected"', "4"],
  ['"peers_disconnected"', "2"],
];

/** The roadmap, in the order the README gives it. */
export const NEXT: { step: string; title: string; body: string; state: "next" | "later" }[] = [
  {
    step: "01",
    title: "Detect",
    body: "An RTCP collector in the media path: loss, jitter, round trip, NACK and freeze ratio per peer, every 500 ms.",
    state: "next",
  },
  {
    step: "02",
    title: "Explain",
    body: "Each number compared to your threshold, so the incident names the peer, the path and the cause.",
    state: "later",
  },
  {
    step: "03",
    title: "Recover",
    body: "Request a keyframe, drop a simulcast layer or fall back to audio, and log what was done.",
    state: "later",
  },
];

export const V2_START: Record<"cargo" | "compose", { label: string; lines: StartLine[] }> = {
  cargo: {
    label: "cargo",
    lines: [
      { p: "$", v: "git clone https://github.com/lumyx-dev/sfu-core && cd sfu-core" },
      { p: "$", v: "mkcert -install && mkcert localhost 127.0.0.1" },
      { p: "$", v: "cargo run --release" },
      { p: "#", v: "open https://localhost:3000 in two tabs", dim: true },
    ],
  },
  compose: {
    label: "docker compose",
    lines: [
      { p: "$", v: "git clone https://github.com/lumyx-dev/self-hosted.git lumyx && cd lumyx" },
      { p: "$", v: "cp .env.example .env" },
      { p: "$", v: "docker compose up -d" },
      { p: "#", v: "clients connect to wss://$SFU_DOMAIN/ws", dim: true },
    ],
  },
};

export const V2_STEPS = [
  "Generate a local certificate: browsers only allow WebRTC over HTTPS",
  "Start the SFU, which serves a test client on /",
  "Open it in two tabs and watch the video cross the forwarder",
];

export const V2_FAQ: { q: string; a: string }[] = [
  {
    q: "Is Lumyx ready for production?",
    a: "Not yet. ICE, DTLS, SRTP and selective forwarding work end to end. There is no STUN client yet, so peers must reach the advertised host directly. Quality metrics, alerting and simulcast are on the roadmap.",
  },
  {
    q: "Do I need an SDK?",
    a: "No. Clients speak plain JSON over a WebSocket and use the browser's RTCPeerConnection. The protocol is in the README.",
  },
  {
    q: "What does the AGPL mean for my product?",
    a: "Running Lumyx unmodified behind your app triggers nothing: your code talks to it over WebSocket and WebRTC and stays yours. If you modify the SFU and serve it over a network, you publish those changes.",
  },
  {
    q: "Where does call data go?",
    a: "Nowhere. Lumyx runs on your server and keeps room state in process. Nothing is sent to us.",
  },
  {
    q: "How can I help?",
    a: "Run it against your own calls and tell us what broke or what is missing. Issues and pull requests are welcome.",
  },
];

export const V2_FOOTER = [
  {
    t: "Product",
    links: [
      { label: "Today", href: "/v2#today" },
      { label: "Roadmap", href: "/v2#next" },
      { label: "FAQ", href: "/v2#faq" },
    ],
  },
  {
    t: "Developers",
    links: [
      { label: "Quick start", href: README_QUICKSTART },
      { label: "Docs", href: DOCS_URL },
      { label: "Self-hosting", href: SELF_HOSTED },
    ],
  },
  {
    t: "Open source",
    links: [
      { label: "GitHub", href: REPO },
      { label: "License", href: `${REPO}/blob/main/LICENSE` },
      { label: "Contributing", href: `${REPO}/blob/main/CONTRIBUTING.md` },
    ],
  },
];
