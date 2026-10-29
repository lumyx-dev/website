import type { NextConfig } from 'next';

const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.lumyx.dev';

const nextConfig: NextConfig = {
  // @lumyx/ui exporte du TypeScript source, pas un build — Next le transpile.
  transpilePackages: ['@lumyx/ui'],
  env: {
    CLOUD_APP_URL: process.env.CLOUD_APP_URL
  },
  // La documentation a demenage sur docs.lumyx.dev. Deux regles : `/docs/:path*` ne capture pas
  // `/docs` nu, et c'est l'URL la plus liee des deux.
  async redirects() {
    return [
      { source: '/docs', destination: DOCS_URL, permanent: true },
      { source: '/docs/:path*', destination: `${DOCS_URL}/:path*`, permanent: true },
    ];
  }
};

export default nextConfig;
