# apps/docs — docs.lumyx.dev

Astro 7 + Starlight, fully static, deployed on Vercel through `@astrojs/vercel`.

- Pages are MDX in `src/content/docs/`; each page imports the components it uses (Starlight's `Aside`, `@lumyx/ui`, `src/components/*`). There is no global MDX component map.
- Sidebar order lives in `src/lib/sidebar.json` (`---Section---` entries open a group).
- `stub: true` in frontmatter marks an outline page: kept in the sidebar, excluded from the sitemap (`src/lib/sitemap.ts`), `noindex` (`src/route-middleware.ts`). Not `draft`, which Starlight drops from production builds.
- Starlight overrides in `src/components/starlight/` (theme toggle, wordmark, page title). Theme: dark by default, no system tracking, stored under `localStorage.theme` — same as the landing.
- Styling: `src/styles/global.css` maps Starlight's `--sl-*` variables onto the `@lumyx/ui` tokens. Expressive Code is off; Astro's Shiki uses `lumyxCodeTheme` (`src/lib/markdown.ts`).
- Public env vars use the `PUBLIC_` prefix (`PUBLIC_SITE_URL`, `PUBLIC_DOCS_URL`).
