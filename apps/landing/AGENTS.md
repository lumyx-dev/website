# apps/landing — lumyx.dev

Astro 7, fully static (`output: 'static'`), deployed on Vercel through `@astrojs/vercel`.

- Pages in `src/pages/`; the shared shell is `src/layouts/base.astro`. Interactive pieces are React islands from `src/components/`, rendered with `@astrojs/react` (`experimentalReactChildren`, see `astro.config.ts`).
- `_pricing`, `_changelog` and `_blog` are disabled routes (leading underscore = not built).
- `/docs` redirects to docs.lumyx.dev: the bare path in `astro.config.ts`, subpaths through the on-demand route `src/pages/docs/[...path].ts`.
- Public env vars use the `PUBLIC_` prefix (`PUBLIC_SITE_URL`, `PUBLIC_DOCS_URL`), read in `src/lib/env.ts`.
- Design-system constraints are enforced by `scripts/verify-ds.mjs` (`bun run verify:ds`): `src/styles/global.css` is the only CSS file and the only place a literal colour may appear.
