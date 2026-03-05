/**
 * Team API client — dedicated axios instance for VA internal tool.
 *
 * Uses a separate localStorage key ("team-token") so team sessions never
 * interfere with customer sessions managed by the main apiClient.
 */

import axios, { type AxiosInstance } from 'axios';
import { toast } from 'sonner';

import { API_BASE_URL, TEAM_ENDPOINTS, TEAM_SLUG } from '@/lib/constants';
import type {
  TeamBatchCancelResponse,
  TeamBatchCreateResponse,
  TeamBatchListResponse,
  TeamBatchStatus,
  TeamLoginResponse,
} from '@/types';

const TEAM_TOKEN_KEY = 'team-token';

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

export const teamTokenStorage = {
  get: (): string | null =>
    typeof window !== 'undefined' ? localStorage.getItem(TEAM_TOKEN_KEY) : null,

  set: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TEAM_TOKEN_KEY, token);
    }
  },

  clear: (): void => {
    if (typeof window !== 'undefined') localStorage.removeItem(TEAM_TOKEN_KEY);
  },

  has: (): boolean => !!teamTokenStorage.get(),
};

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

const teamClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

teamClient.interceptors.request.use(config => {
  const token = teamTokenStorage.get();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

teamClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      teamTokenStorage.clear();
      toast.error('Session expired — please sign in again');
      if (!TEAM_SLUG) {
        console.warn(
          '[teamApi] NEXT_PUBLIC_TEAM_SLUG is not set — cannot redirect to team login'
        );
        window.location.href = '/';
      } else {
        window.location.href = `/ops/${TEAM_SLUG}/login`;
      }
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// API methods
// ---------------------------------------------------------------------------

export const teamApi = {
  /** Authenticate with email + password; store JWT on success. */
  async login(email: string, password: string): Promise<TeamLoginResponse> {
    const { data } = await teamClient.post<TeamLoginResponse>(
      TEAM_ENDPOINTS.LOGIN,
      {
        email,
        password,
      }
    );
    teamTokenStorage.set(data.access_token);
    return data;
  },

  /** Logout — best-effort server revocation, always clear local token. */
  async logout(): Promise<void> {
    try {
      await teamClient.post(TEAM_ENDPOINTS.LOGOUT);
    } catch {
      // Best-effort — always clear token locally
    } finally {
      teamTokenStorage.clear();
    }
  },

  /** Upload a CSV file and kick off the batch. */
  async uploadCsv(file: File): Promise<TeamBatchCreateResponse> {
    const form = new FormData();
    form.append('file', file);
    const { data } = await teamClient.post<TeamBatchCreateResponse>(
      TEAM_ENDPOINTS.CSV_UPLOAD,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  /** List all batches for the current team member. */
  async listBatches(): Promise<TeamBatchListResponse> {
    const { data } = await teamClient.get<TeamBatchListResponse>(
      TEAM_ENDPOINTS.BATCH_LIST
    );
    return data;
  },

  /** Poll status of a specific batch. */
  async getBatchStatus(id: string): Promise<TeamBatchStatus> {
    const { data } = await teamClient.get<TeamBatchStatus>(
      TEAM_ENDPOINTS.BATCH_STATUS(id)
    );
    return data;
  },

  /**
   * Download the result CSV as a Blob.
   * Call URL.createObjectURL() on the result to trigger a browser download.
   */
  async exportCsv(id: string): Promise<Blob> {
    const { data } = await teamClient.get<Blob>(
      TEAM_ENDPOINTS.BATCH_EXPORT(id),
      {
        responseType: 'blob',
      }
    );
    return data;
  },

  /** Cancel a pending/processing batch. */
  async cancelBatch(id: string): Promise<TeamBatchCancelResponse> {
    const { data } = await teamClient.post<TeamBatchCancelResponse>(
      TEAM_ENDPOINTS.BATCH_CANCEL(id)
    );
    return data;
  },
};
