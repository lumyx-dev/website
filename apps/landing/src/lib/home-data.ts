/**
 * Content of the home page (design: "Lumyx Home", Claude Design).
 * Every "works today" claim mirrors the Project status table of the sfu-core README —
 * keep the two in step.
 */
import { DOCS_URL, REPO } from "./site-data";

export const DOCKER_RUN = "docker run -p 3000:3000 ghcr.io/lumyx-dev/sfu-core:latest";

export const NAV = [
  { href: "/#product", label: "Product" },
  { href: "/#topology", label: "Observability" },
  { href: DOCS_URL, label: "Docs" },
  { href: REPO, label: "GitHub" },
];

export const METRIC_NAMES = [
  "packet_loss_ratio", "rtt_ms", "jitter_ms", "nack_ratio", "freeze_ratio", "bitrate_kbps",
  "forwarded_bytes_total", "ice_candidate_type", "jitter_buffer_delay_ms", "pli_count",
  "srtp_decrypt_errors", "rooms_active",
];

export type Pain = {
  n: string;
  title: string;
  body: string;
  src: string;
  kv: { k: string; v: string; faint?: boolean }[];
};

export const PAINS: Pain[] = [
  {
    n: "01",
    title: "Self-hosting shouldn’t mean three services and a Redis.",
    body: "Signaling, forwarding and the dashboard run in one process. One command starts it; there is nothing else to deploy or keep in sync.",
    src: "docker run",
    kv: [
      { k: "processes", v: "1" },
      { k: "external dependencies", v: "none" },
      { k: "config to start", v: "0 lines" },
      { k: "image", v: "ghcr.io/lumyx-dev/sfu-core" },
      { k: "license", v: "MIT" },
    ],
  },
  {
    n: "02",
    title: "Stop bolting Grafana onto your SFU.",
    body: "The forwarder already sees every RTCP report. Lumyx keeps the six numbers that explain a bad call, per peer and per room, and pages Slack or PagerDuty when one crosses its threshold.",
    src: "per peer · per room · 500 ms",
    kv: [
      { k: "jitter_ms", v: "> 30" },
      { k: "packet_loss_ratio", v: "> 0.02" },
      { k: "rtt_ms", v: "> 200" },
      { k: "nack_ratio", v: "> 0.05" },
      { k: "freeze_ratio", v: "> 0.01" },
      { k: "bitrate_kbps", v: "< 100" },
    ],
  },
  {
    n: "03",
    title: "Written in Rust, not Go with CGO.",
    body: "The hot path is Rust end to end. No garbage collector pausing forwarding mid-frame, no FFI boundary to cross for SRTP.",
    src: "media path",
    kv: [
      { k: "media path", v: "Rust" },
      { k: "GC pauses", v: "none" },
      { k: "CGO / FFI boundary", v: "none" },
      { k: "measured throughput", v: "benchmark pending", faint: true },
    ],
  },
];

export const TOPO_LEGEND = [
  { kind: "line", label: "Direct path" },
  { kind: "dashed", label: "TURN relay" },
  { kind: "warn", label: "Approaching" },
  { kind: "bad", label: "Breached" },
] as const;

export type CodeLang = "toml" | "ts" | "prom" | "json";

export type Snippet = {
  label: string;
  lang: CodeLang;
  /** 1-based, inclusive line range banded with the accent tint. */
  hl: [number, number];
  note: string;
  lines: string[];
};

export const SNIPPETS: Record<"toml" | "ts" | "prom" | "json", Snippet> = {
  toml: {
    label: "lumyx.toml",
    lang: "toml",
    hl: [7, 12],
    note: "Draft config shape — today the SFU reads environment variables. Thresholds, alert destinations and remediation are on the roadmap.",
    lines: [
      "# lumyx.toml — read at startup",
      "[server]",
      'listen = "0.0.0.0:3000"',
      'region = "eu-west-3"',
      "",
      "[thresholds]",
      "packet_loss_ratio = 0.02",
      "rtt_ms = 200",
      "jitter_ms = 30",
      "nack_ratio = 0.05",
      "freeze_ratio = 0.01",
      'debounce = "30s"',
      "",
      "[alerts.slack]",
      'webhook = "env:SLACK_WEBHOOK_URL"',
      'min_severity = "warning"',
      "",
      "[alerts.pagerduty]",
      'routing_key = "env:PD_ROUTING_KEY"',
      'min_severity = "critical"',
      "",
      "[remediation]",
      "audio_only_fallback = true",
      "simulcast_drop_layer = true",
    ],
  },
  ts: {
    label: "signaling.ts",
    lang: "ts",
    hl: [5, 5],
    note: "WebSocket signaling works today. Plain JSON envelopes and RTCPeerConnection — no client SDK to install.",
    lines: [
      "// No SDK: plain JSON over a WebSocket.",
      'const ws = new WebSocket("wss://sfu.example.com/ws")',
      "const pc = new RTCPeerConnection()",
      "",
      'ws.send(JSON.stringify({ type: "join", room_id: "webinar-us", peer_id: "a3f91c02" }))',
      "",
      "const offer = await pc.createOffer()",
      "await pc.setLocalDescription(offer)",
      'ws.send(JSON.stringify({ type: "sfu_offer", sdp: offer.sdp }))',
    ],
  },
  prom: {
    label: "GET /metrics",
    lang: "prom",
    hl: [3, 5],
    note: "Prometheus exposition format. Planned — the dashboard reads the same series.",
    lines: [
      "# HELP lumyx_peer_rtt_ms Round-trip time per peer",
      "# TYPE lumyx_peer_rtt_ms gauge",
      'lumyx_peer_rtt_ms{room="webinar-us",peer="ff104b2c"} 284',
      'lumyx_peer_packet_loss_ratio{room="webinar-us",peer="ff104b2c"} 0.079',
      'lumyx_peer_jitter_ms{room="webinar-us",peer="ff104b2c"} 42',
      'lumyx_room_forwarded_bytes_total{room="webinar-us"} 1384920113',
    ],
  },
  json: {
    label: "webhook.json",
    lang: "json",
    hl: [5, 8],
    note: "Payload POSTed to your webhook when a threshold is crossed. Draft shape.",
    lines: [
      "{",
      '  "event": "threshold.breached",',
      '  "room": "webinar-us",',
      '  "peer": "ff104b2c",',
      '  "metric": "packet_loss_ratio",',
      '  "value": 0.079,',
      '  "threshold": 0.02,',
      '  "duration_s": 192,',
      '  "remediation": {',
      '    "action": "audio_only_fallback",',
      '    "applied_at": "14:06:41Z"',
      "  }",
      "}",
    ],
  },
};

export type SnippetKey = keyof typeof SNIPPETS;

export const STEPS: { n: string; title: string; body: string; tab: SnippetKey; hl: [number, number]; planned?: boolean }[] = [
  { n: "01", title: "Set thresholds", body: "Six numbers per environment. Crossing one for longer than the debounce opens an alert.", tab: "toml", hl: [6, 12] },
  { n: "02", title: "Pick destinations", body: "Slack for warnings, PagerDuty for critical, a webhook for anything else.", tab: "toml", hl: [14, 20], planned: true },
  { n: "03", title: "Let it remediate", body: "Force audio-only for a degrading peer, or drop its top simulcast layer. The alert says it did.", tab: "json", hl: [9, 12], planned: true },
];

export type StartLine = { p: string; v: string; dim?: boolean; href?: string };

export const START: Record<"docker" | "cargo" | "cloud", { label: string; lines: StartLine[] }> = {
  docker: {
    label: "docker run",
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
  cloud: {
    label: "Lumyx Cloud",
    lines: [
      { p: "#", v: "Managed hosting, same binary. Not needed to try Lumyx.", dim: true },
      { p: "→", v: `${DOCS_URL.replace(/^https?:\/\//, "")}/cloud`, href: `${DOCS_URL}/cloud` },
    ],
  },
};

export type StartKey = keyof typeof START;

export const NOS = [
  { t: "No GC pauses", d: "Rust in the media path." },
  { t: "No exporter to write", d: "Metrics come from the forwarder." },
  { t: "No Redis", d: "Room state lives in the process." },
  { t: "No SDK to install", d: "Plain JSON over a WebSocket." },
];

/** `true` = ships in the current alpha, `false` = planned. */
export const FEATURE_GROUPS: { name: string; items: [string, boolean][] }[] = [
  { name: "Media", items: [["Selective forwarding", true], ["ICE", true], ["DTLS", true], ["SRTP", true], ["RTP forwarding", true], ["Simulcast layers", false], ["TURN fallback", false]] },
  { name: "Observability", items: [["RTCP metrics collector", false], ["Six metrics per peer", false], ["Per-room rollups", false], ["Room topology", false], ["Prometheus /metrics", false], ["Session replay", false]] },
  { name: "Alerting", items: [["Thresholds per environment", false], ["Debounce", false], ["Slack", false], ["PagerDuty", false], ["Webhooks", false], ["Audio-only fallback", false]] },
  { name: "Operations", items: [["Single process", true], ["Docker image", true], ["WebSocket signaling", true], ["Room manager", true], ["Lumyx Cloud", false]] },
];

export const WORKS = [
  { t: "ICE, DTLS, SRTP", d: "end to end" },
  { t: "RTP forwarding", d: "selective" },
  { t: "Room manager", d: "join · leave · tracks" },
  { t: "WebSocket signaling", d: "offer · answer · ice" },
  { t: "Test suite", d: "147 tests" },
  { t: "Docker image", d: "sfu-core:latest" },
];

export const PLANNED = [
  { t: "Quality metrics", d: "jitter · loss · RTT · NACK" },
  { t: "Thresholds and alerting", d: "Slack · PagerDuty · webhook" },
  { t: "Automatic remediation", d: "audio-only · layer drop" },
  { t: "Built-in dashboard", d: "topology · replay" },
  { t: "Simulcast", d: "3 layers" },
  { t: "Published benchmark", d: "pending" },
];

/** Every entry resolves to a page that exists. */
export const FOOTER_COLS = [
  {
    t: "Product",
    links: [
      { label: "Observability", href: "/#product" },
      { label: "Room topology", href: "/#topology" },
      { label: "Project status", href: "/#status" },
      { label: "Lumyx Cloud", href: `${DOCS_URL}/cloud` },
    ],
  },
  {
    t: "Developers",
    links: [
      { label: "Quickstart", href: `${DOCS_URL}/quickstart` },
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
