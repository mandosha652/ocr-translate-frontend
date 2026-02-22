export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEV_AUTH_BYPASS: process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true',
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
} as const;

// Build-time validation — runs on the server during build and startup.
// Throws so the build fails loudly if required vars are missing in production.
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_API_URL) missing.push('NEXT_PUBLIC_API_URL');
  if (missing.length > 0) {
    throw new Error(
      `[config] Missing required environment variables: ${missing.join(', ')}. ` +
        'Set these in your deployment environment.'
    );
  }
}

export const isDev = env.NODE_ENV === 'development';
export const shouldBypassAuth = isDev && env.DEV_AUTH_BYPASS;

if (typeof window !== 'undefined') {
  if (!isDev && !process.env.NEXT_PUBLIC_API_URL) {
    console.warn(
      '[config] NEXT_PUBLIC_API_URL is not set — falling back to http://localhost:8000. ' +
        'Set this env var in production.'
    );
  }

  if (!isDev && env.DEV_AUTH_BYPASS) {
    console.error(
      '[config] NEXT_PUBLIC_DEV_AUTH_BYPASS=true is set in a non-development environment. ' +
        'This bypasses authentication and must not be enabled in production. ' +
        'Remove this env var immediately.'
    );
  }

  if (!isDev && !env.SENTRY_DSN) {
    console.warn(
      '[config] NEXT_PUBLIC_SENTRY_DSN is not set — error tracking is disabled in production.'
    );
  }
}
