export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const ENDPOINTS = {
  // Auth
  REGISTER: '/api/v1/auth/register',
  LOGIN: '/api/v1/auth/login',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH: '/api/v1/auth/refresh',
  ME: '/api/v1/auth/me',

  // API Keys
  API_KEYS: '/api/v1/auth/api-keys',

  // Email flows
  VERIFY_EMAIL: '/api/v1/auth/verify-email',
  RESEND_VERIFICATION: '/api/v1/auth/resend-verification',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password',

  // Usage & account
  USAGE_STATS: '/api/v1/me/usage',
  CHANGE_PASSWORD: '/api/v1/auth/change-password',
  DELETE_ACCOUNT: '/api/v1/auth/me',

  // Translation
  TRANSLATE_IMAGE: '/api/v1/translate-image',
  BATCH_TRANSLATE: '/api/v1/batch/translate',
  BATCH_LIST: '/api/v1/batch',
  BATCH_STATUS: (batchId: string) => `/api/v1/batch/${batchId}`,
  BATCH_CANCEL: (batchId: string) => `/api/v1/batch/${batchId}/cancel`,
  BATCH_RETRY_IMAGE: (batchId: string, imageId: string) =>
    `/api/v1/team/batch/${batchId}/image/${imageId}/retry`,
  BATCH_RETRY_FAILED: (batchId: string) =>
    `/api/v1/team/batch/${batchId}/retry-failed`,
  BATCH_UPDATE_CAPTION: (batchId: string) =>
    `/api/v1/team/batch/${batchId}/caption`,
  BATCH_EXPORT: (batchId: string) => `/api/v1/team/batch/${batchId}/export`,
  BATCH_STREAM: (batchId: string) => `/api/v1/batch/${batchId}/stream`,
  API_KEY_STATS: (keyId: string) => `/api/v1/auth/api-keys/${keyId}/stats`,
  TRANSLATE_HISTORY: '/api/v1/history',

  // Async translation jobs
  TRANSLATE_JOB_SUBMIT: '/api/v1/translate',
  TRANSLATE_JOB_STATUS: (jobId: string) => `/api/v1/translate/${jobId}`,

  // Admin
  ADMIN_STATS: '/api/v1/admin/stats',
  ADMIN_USERS: '/api/v1/admin/users',
  ADMIN_USER: (userId: string) => `/api/v1/admin/users/${userId}`,
  ADMIN_USER_IMPERSONATE: (userId: string) =>
    `/api/v1/admin/users/${userId}/impersonate`,
  ADMIN_USER_RESEND_VERIFICATION: (userId: string) =>
    `/api/v1/admin/users/${userId}/resend-verification`,
  ADMIN_USER_API_KEYS: (userId: string) =>
    `/api/v1/admin/users/${userId}/api-keys`,
  ADMIN_USER_API_KEY: (userId: string, keyId: string) =>
    `/api/v1/admin/users/${userId}/api-keys/${keyId}`,
  ADMIN_BATCHES: '/api/v1/admin/batches',
  ADMIN_BATCH: (batchId: string) => `/api/v1/admin/batches/${batchId}`,
  ADMIN_BATCH_CANCEL: (batchId: string) =>
    `/api/v1/admin/batches/${batchId}/cancel`,
  ADMIN_BATCH_RETRY: (batchId: string) =>
    `/api/v1/admin/batches/${batchId}/retry`,
  ADMIN_BATCHES_RESUME_STUCK: '/api/v1/admin/batches/resume-stuck',
  ADMIN_IMAGE_RETRY: (imageId: string) =>
    `/api/v1/admin/images/${imageId}/retry`,

  // Admin — Costs
  ADMIN_COSTS_SUMMARY: '/api/v1/admin/costs/summary',
  ADMIN_COSTS_DAILY: '/api/v1/admin/costs/daily',
  ADMIN_COSTS_BY_USER: '/api/v1/admin/costs/by-user',

  // Admin — Health
  ADMIN_HEALTH_SERVICES: '/api/v1/admin/health/services',
  ADMIN_HEALTH: '/api/v1/admin/health',

  // Admin — Cleanup
  ADMIN_CLEANUP_RUN: '/api/v1/admin/cleanup/run',
  ADMIN_CLEANUP_LAST_RUN: '/api/v1/admin/cleanup/last-run',

  // Admin — Dev Reset
  ADMIN_DEV_RESET: '/api/v1/admin/dev/reset',

  // Admin — GDPR
  ADMIN_TENANT_FILES: (tenantId: string) =>
    `/api/v1/admin/tenants/${tenantId}/files`,
} as const;
