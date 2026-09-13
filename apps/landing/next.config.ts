import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // @lumyx/ui exporte du TypeScript source, pas un build — Next le transpile.
  transpilePackages: ['@lumyx/ui'],
  env: {
    CLOUD_APP_URL: process.env.CLOUD_APP_URL
  }
};

export default nextConfig;
