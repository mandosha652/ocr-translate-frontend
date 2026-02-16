export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_VERSION = 'v1';

export const ENDPOINTS = {
  // Auth
  REGISTER: '/api/v1/auth/register',
  LOGIN: '/api/v1/auth/login',
  REFRESH: '/api/v1/auth/refresh',
  ME: '/api/v1/auth/me',

  // API Keys
  API_KEYS: '/api/v1/auth/api-keys',

  // Translation
  TRANSLATE_IMAGE: '/api/v1/translate/translate-image',
  BATCH_TRANSLATE: '/api/v1/translate/batch/translate',
  BATCH_STATUS: (batchId: string) => `/api/v1/translate/batch/${batchId}`,
  BATCH_CANCEL: (batchId: string) =>
    `/api/v1/translate/batch/${batchId}/cancel`,
} as const;

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_BATCH_SIZE = 20;
export const MAX_TARGET_LANGUAGES = 5;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;
