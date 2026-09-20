// METRICS, DOC_NAV, DocNavItem et DocNavSection ont demenage avec la documentation
// dans apps/docs (lib/metrics-data.ts et content/docs/meta.json). Ne reste ici que
// RELEASES, consomme par app/_changelog.
export const RELEASES = [
  {
    version: "v0.4.1", date: "26 Aug 2026", commit: "a3f91c0", latest: true,
    summary: "Freeze ratio joins the default threshold set, and the room topology view gets per-edge bitrate. Mostly a collector release.",
    groups: [
      { kind: "Added", tone: "ok" as const, items: [
        "freeze_ratio is now armed by default at 1%, with the same 30s debounce as the other five metrics.",
        "Room topology reports bitrate per edge, so a saturated uplink is visible without opening a peer.",
        "Prometheus endpoint exposes per-room labels alongside the existing per-peer series.",
      ]},
      { kind: "Fixed", tone: "neutral" as const, items: [
        "NACK ratio was averaged over the wrong window on tracks with simulcast enabled, under-reporting by roughly 12%.",
        "A peer that reconnected within the debounce window could raise a duplicate alert.",
      ]},
    ],
  },
  {
    version: "v0.4.0", date: "11 Aug 2026", commit: "7d20b48", latest: false,
    summary: "Session replay lands: metrics and signaling events for a finished session, timestamped and queryable for the retention window.",
    breaking: "The metrics payload field loss_pct is renamed packet_loss_ratio and is now a ratio (0–1) rather than a percentage. Update any consumer that reads it directly — the dashboard and webhooks handle both for one more minor version.",
    groups: [
      { kind: "Added", tone: "ok" as const, items: [
        "Session replay for finished sessions, with signaling events interleaved on the same timeline.",
        "CSV export of a session or a date range from the dashboard and the REST API.",
      ]},
      { kind: "Changed", tone: "room" as const, items: [
        "Stats interval drops from 5s to 2s. Storage per peer-hour roughly doubles; retention limits are unchanged.",
        "Thresholds move from global config to per project and per environment.",
      ]},
    ],
  },
  {
    version: "v0.3.8", date: "29 Jul 2026", commit: "c27ad93", latest: false,
    summary: "Signaling hardening: token grants are checked per room and per capability, and webhook deliveries are now signed.",
    groups: [
      { kind: "Added", tone: "ok" as const, items: [
        "Token grants scoped per capability: publish, subscribe, publishData, roomAdmin.",
        "Signed webhooks for room.* and alert.* events, with delivery failures surfaced in Alerts.",
      ]},
      { kind: "Fixed", tone: "neutral" as const, items: [
        "ICE restart could leave a stale forwarding entry for up to one stats interval.",
        "Dashboard showed a disconnected peer as degraded rather than disconnected.",
      ]},
    ],
  },
  {
    version: "v0.3.0", date: "2 Jul 2026", commit: "1f84e20", latest: false,
    summary: "First public release. Selective forwarding, the six metrics, default thresholds, and the dashboard that ships with the binary.",
    groups: [
      { kind: "Added", tone: "ok" as const, items: [
        "Selective forwarding with ICE, DTLS and SRTP, in a single static binary.",
        "Six metrics collected in the media path, per peer and per room.",
        "Dashboard with overview, rooms, room detail and alerts.",
      ]},
    ],
  },
];
