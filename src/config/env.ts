export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEV_AUTH_BYPASS: process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true',
} as const;

export const isDev = env.NODE_ENV === 'development';
export const shouldBypassAuth = isDev && env.DEV_AUTH_BYPASS;
