import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: {
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE || 'false',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: 'imgtext.io',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: 'imgtext',

  project: 'imgtext',

  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: !process.env.CI,

  widenClientFileUpload: true,

  tunnelRoute: '/monitoring',

  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
