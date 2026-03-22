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
  BatchCreateResponse,
  TeamBatchCancelResponse,
  TeamBatchCreateResponse,
  TeamBatchListResponse,
  TeamBatchStatus,
  TeamLoginResponse,
  TeamQuickTranslateResponse,
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

  /**
   * Quick-translate a single image (file upload or URL).
   * Sends as multipart/form-data with optional image file.
   */
  async quickTranslate(params: {
    file?: File;
    imageUrl?: string;
    caption?: string;
    sourceLang: string;
    targetLangs: string[];
    excludeText?: string;
    removeLogo?: boolean;
  }): Promise<TeamQuickTranslateResponse> {
    const form = new FormData();
    if (params.file) {
      form.append('file', params.file);
    }
    if (params.imageUrl) {
      form.append('image_url', params.imageUrl);
    }
    if (params.caption) {
      form.append('caption', params.caption);
    }
    form.append('source_lang', params.sourceLang);
    form.append('target_langs', params.targetLangs.join(','));
    if (params.excludeText) {
      form.append('exclude_text', params.excludeText);
    }
    if (params.removeLogo) {
      form.append('remove_logo', 'true');
    }
    const { data } = await teamClient.post<TeamQuickTranslateResponse>(
      TEAM_ENDPOINTS.QUICK_TRANSLATE,
      form,
      { headers: { 'Content-Type': undefined } }
    );
    return data;
  },

  /** Upload a CSV file and kick off the batch. */
  async uploadCsv(
    file: File,
    options?: { excludeText?: string; removeLogo?: boolean }
  ): Promise<TeamBatchCreateResponse> {
    const form = new FormData();
    form.append('file', file);
    if (options?.excludeText) {
      form.append('exclude_text', options.excludeText);
    }
    if (options?.removeLogo) {
      form.append('remove_logo', 'true');
    }
    const { data } = await teamClient.post<TeamBatchCreateResponse>(
      TEAM_ENDPOINTS.CSV_UPLOAD,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  /**
   * Create a batch from uploaded images or public URLs.
   * Uses the standard batch endpoint with the team JWT.
   */
  async uploadBatch(
    input: { files: File[] } | { imageUrls: string[] },
    targetLanguages: string[],
    options?: {
      sourceLang?: string;
      excludeText?: string;
      removeLogo?: boolean;
    }
  ): Promise<BatchCreateResponse> {
    const form = new FormData();

    if ('files' in input) {
      for (const file of input.files) {
        form.append('files', file);
      }
    } else {
      form.append('image_urls', input.imageUrls.join(','));
    }

    form.append('target_languages', targetLanguages.join(','));

    if (options?.sourceLang && options.sourceLang !== 'auto') {
      form.append('source_language', options.sourceLang);
    }
    if (options?.excludeText) {
      form.append('exclude_text', options.excludeText);
    }
    if (options?.removeLogo) {
      form.append('remove_logo', 'true');
    }

    const { data } = await teamClient.post<BatchCreateResponse>(
      TEAM_ENDPOINTS.BATCH_UPLOAD,
      form,
      { headers: { 'Content-Type': undefined } }
    );
    return data;
  },

  /** List batches for the current team member with pagination. */
  async listBatches(options?: {
    limit?: number;
    offset?: number;
  }): Promise<TeamBatchListResponse> {
    const { data } = await teamClient.get<TeamBatchListResponse>(
      TEAM_ENDPOINTS.BATCH_LIST,
      {
        params: {
          limit: options?.limit ?? 10,
          offset: options?.offset ?? 0,
        },
      }
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

  /** Retry a single failed image. */
  async retryImage(
    batchId: string,
    imageId: string
  ): Promise<{ status: string }> {
    const { data } = await teamClient.post<{ status: string }>(
      `/api/v1/team/batch/${batchId}/image/${imageId}/retry`
    );
    return data;
  },

  /** Retry all failed images in a batch. */
  async retryAllFailed(
    batchId: string
  ): Promise<{ status: string; retried_count: number }> {
    const { data } = await teamClient.post<{
      status: string;
      retried_count: number;
    }>(`/api/v1/team/batch/${batchId}/retry-failed`);
    return data;
  },

  /** Update a translated caption. */
  async updateCaption(
    batchId: string,
    imageId: string,
    lang: string,
    caption: string
  ): Promise<{ status: string }> {
    const { data } = await teamClient.patch<{ status: string }>(
      `/api/v1/team/batch/${batchId}/caption`,
      { image_id: imageId, lang, caption }
    );
    return data;
  },

  /**
   * Open an SSE stream for batch progress.
   *
   * EventSource doesn't support Authorization headers, so the JWT is sent
   * as a `token` query parameter. The backend reads it via the standard
   * bearer token fallback.
   *
   * @param id       Batch ID to stream
   * @param onEvent  Called on each progress event
   * @param onDone   Called when the batch reaches a terminal state
   * @param onError  Called on connection error
   * @returns        Cleanup function — call it to close the stream
   */
  streamBatchProgress(
    id: string,
    onEvent: (event: {
      batch_id: string;
      status: string;
      total_images: number;
      completed_count: number;
      failed_count: number;
      total_translations: number;
      completed_translations: number;
      done: boolean;
    }) => void,
    onDone: () => void,
    onError?: (err: Event) => void
  ): () => void {
    const token = teamTokenStorage.get();
    const url = `${API_BASE_URL}${TEAM_ENDPOINTS.BATCH_STREAM(id)}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    const es = new EventSource(url);

    es.onmessage = e => {
      try {
        const data = JSON.parse(e.data as string);
        onEvent(data);
        if (data.done) {
          es.close();
          onDone();
        }
      } catch {
        // ignore malformed frames
      }
    };

    es.onerror = err => {
      es.close();
      onError?.(err);
    };

    return () => es.close();
  },

  /** Resize translated images to 1080×1350. Pass null for all. */
  async resizeTranslations(
    batchId: string,
    translationIds: string[] | null
  ): Promise<{ status: string; resized_count: number; errors: string[] }> {
    const { data } = await teamClient.post<{
      status: string;
      resized_count: number;
      errors: string[];
    }>(`/api/v1/team/batch/${batchId}/resize`, {
      translation_ids: translationIds,
    });
    return data;
  },
};
