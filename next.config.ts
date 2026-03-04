import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

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
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self'${isDev ? " 'unsafe-inline' 'unsafe-eval'" : ''} https://vercel.live https://*.vercel-scripts.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https:" +
        (isDev ? ' http://localhost:*' : ''),
      "font-src 'self'",
      "connect-src 'self' https://o4510886285672448.ingest.us.sentry.io https://vercel.live wss:" +
        (isDev
          ? ' http://localhost:* ws://localhost:*'
          : ` ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}`),
      "worker-src 'self' blob:",
      "media-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
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
