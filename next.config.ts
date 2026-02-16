import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  silent: !process.env.CI,

  widenClientFileUpload: true,

  reactComponentAnnotation: {
    enabled: true,
  },

  sourcemaps: {
    disable: true,
  },

  disableLogger: true,

  automaticVercelMonitors: true,
});
