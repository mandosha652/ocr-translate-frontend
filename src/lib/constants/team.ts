export const TEAM_ENDPOINTS = {
  LOGIN: '/api/v1/team/auth/login',
  LOGOUT: '/api/v1/team/auth/logout',
  CSV_UPLOAD: '/api/v1/team/csv',
  BATCH_LIST: '/api/v1/team/batches',
  BATCH_STATUS: (id: string) => `/api/v1/team/batch/${id}`,
  BATCH_CANCEL: (id: string) => `/api/v1/team/batch/${id}/cancel`,
  BATCH_EXPORT: (id: string) => `/api/v1/team/batch/${id}/export`,
} as const;

export const TEAM_SLUG = process.env.NEXT_PUBLIC_TEAM_SLUG || '';
