import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imgtext.io';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pricing',
          '/help',
          '/terms',
          '/privacy',
          '/changelog',
          '/api-docs',
          '/case-studies',
        ],
        disallow: [
          // Protected dashboard routes (user auth required)
          '/dashboard',
          '/translate',
          '/batch',
          '/history',
          '/settings',
          // Admin routes (internal only, admin key required)
          '/admin',
          // Virtual Assistant / Operations routes (internal only, secret slug required)
          '/ops',
          // Authentication routes
          '/login',
          '/signup',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
