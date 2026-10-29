# @lumyx/web

The Lumyx marketing site — the public pages (home, pricing, docs, changelog, blog, sign up).
A Next.js App Router app that consumes the shared `@lumyx/ui` component and token library for
all of its UI.

## Not production content

**This app must not be deployed publicly yet.** It builds and runs cleanly, but a large share of
what it says has not been verified against the actual product:

- ~~**The whole positioning is out of date.**~~ **Fixed (LUM-701).** This site was written when
  Lumyx was pitched as a drop-in LiveKit replacement. All of that content is gone: the `/compare`
  page, the "From LiveKit" quickstart tab, the "Migrating" docs nav group, the
  `livekit-pivoted-to-ai-agents` blog post, and every signaling- or SDK-compatibility claim. Those
  claims were never backed by the SFU — the protocol is Lumyx's own JSON, documented in the root
  README — so the pages now describe that protocol instead. The positioning is the root README's:
  observability in the media path, against the low-level SFU toolkits (mediasoup, Janus, ion-sfu).
  Side effect: `/blog` has no posts left and renders an empty state.
- **Pricing** (`lib/site-data.ts`, `app/pricing/`) — plans, quotas, billing units and prices come
  from a design proposal made without access to the Cloud repo.
- **Benchmarks** (`lib/platform-data.ts`) — figures are illustrative, not measured.
- **Releases** (`app/changelog/`) — changelog entries were authored for the design handoff,
  not pulled from an actual release history.
- **The metrics reference** — la doc a demenage sur `docs.lumyx.dev` (`apps/docs`), et cette
  app la redirige. Les six metriques et seuils qu'elle documente n'existent pas dans
  le SFU (`lumyx-dev/sfu-core`) aujourd'hui ; le README la-bas les marque "Planned — next milestone."
A comparison page against mediasoup, Janus and ion-sfu is tracked separately (LUM-631) and must
be factual and sourced — the deleted one compared Lumyx to a "typical Go SFU stack" on claims
nobody had verified.

The remaining items are called out in the design spec's own risk section (§12 of the
marketing-site design spec, kept in the private `lumyx-dev/cloud` repo) — which makes
"must not be deployed publicly" the headline risk of this branch. Confirm the numbers and claims
above against the real implementation before this site goes live anywhere public.

## Running it

From the repository root (`bun run dev` starts both apps through Turborepo), or from this
directory:

```bash
bun run dev
```

The dev server runs on Next.js's default port, [http://localhost:3000](http://localhost:3000).

## Notes

- Content lives under `lib/` (e.g. `lib/site-data.ts`, `lib/docs-data.ts` qui ne porte plus
  que `RELEASES`) rather than hardcoded in components.
- `scripts/verify-ds.mjs` checks this app's CSS/markup against the design system's tokens —
  run it with `bun run verify:ds`.
