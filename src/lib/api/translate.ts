import { ENDPOINTS } from '@/lib/constants';
import type {
  BatchCancelResponse,
  BatchCreateResponse,
  BatchStatusResponse,
  TranslateResponse,
  TranslationHistoryResponse,
  TranslationJobResponse,
} from '@/types';

import apiClient from './client';

export const translateApi = {
  /**
   * Translate text in a single image (synchronous)
   */
  translateImage: async (
    file: File,
    targetLang: string,
    options?: {
      sourceLang?: string;
      excludeText?: string;
      signal?: AbortSignal;
    }
  ): Promise<TranslateResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('target_lang', targetLang);

    if (options?.sourceLang) {
      formData.append('source_lang', options.sourceLang);
    }
    if (options?.excludeText) {
      formData.append('exclude_text', options.excludeText);
    }

    const response = await apiClient.post<TranslateResponse>(
      ENDPOINTS.TRANSLATE_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
        signal: options?.signal,
      }
    );

    return response.data;
  },

  /**
   * Create a batch translation job (async)
   */
  createBatch: async (
    input: { files: File[] } | { imageUrls: string[] },
    targetLanguages: string[],
    options?: {
      sourceLanguage?: string;
      excludeText?: string;
      webhookUrl?: string;
    }
  ): Promise<BatchCreateResponse> => {
    const formData = new FormData();

    if ('files' in input) {
      input.files.forEach(file => {
        formData.append('files', file);
      });
    } else {
      formData.append('image_urls', input.imageUrls.join(','));
    }

    formData.append('target_languages', targetLanguages.join(','));

    if (options?.sourceLanguage) {
      formData.append('source_language', options.sourceLanguage);
    }
    if (options?.excludeText) {
      formData.append('exclude_text', options.excludeText);
    }
    if (options?.webhookUrl) {
      formData.append('webhook_url', options.webhookUrl);
    }

    const response = await apiClient.post<BatchCreateResponse>(
      ENDPOINTS.BATCH_TRANSLATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  /**
   * Get batch job status
   */
  getBatchStatus: async (batchId: string): Promise<BatchStatusResponse> => {
    const response = await apiClient.get<BatchStatusResponse>(
      ENDPOINTS.BATCH_STATUS(batchId)
    );
    return response.data;
  },

  /**
   * Cancel a batch job
   */
  cancelBatch: async (batchId: string): Promise<BatchCancelResponse> => {
    const response = await apiClient.post<BatchCancelResponse>(
      ENDPOINTS.BATCH_CANCEL(batchId)
    );
    return response.data;
  },

  /**
   * List all batch jobs for the current user
   */
  listBatches: async (options?: {
    limit?: number;
    offset?: number;
  }): Promise<BatchStatusResponse[]> => {
    const response = await apiClient.get<BatchStatusResponse[]>(
      ENDPOINTS.BATCH_LIST,
      {
        params: {
          limit: options?.limit ?? 50,
          offset: options?.offset ?? 0,
        },
      }
    );
    return response.data;
  },

  /**
   * Retry a single failed image within a batch
   */
  retryBatchImage: async (
    batchId: string,
    imageId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(ENDPOINTS.BATCH_RETRY_IMAGE(batchId, imageId));
    return response.data;
  },

  /**
   * Submit an async image translation job (returns job_id immediately)
   */
  submitTranslationJob: async (
    input: { file: File } | { imageUrl: string },
    targetLanguage: string,
    options?: { sourceLanguage?: string }
  ): Promise<TranslationJobResponse> => {
    const formData = new FormData();
    if ('file' in input) {
      formData.append('image', input.file);
    } else {
      formData.append('image_url', input.imageUrl);
    }
    formData.append('target_language', targetLanguage);
    if (options?.sourceLanguage) {
      formData.append('source_language', options.sourceLanguage);
    }
    const response = await apiClient.post<TranslationJobResponse>(
      ENDPOINTS.TRANSLATE_JOB_SUBMIT,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  /**
   * Poll async translation job status
   */
  getTranslationJob: async (jobId: string): Promise<TranslationJobResponse> => {
    const response = await apiClient.get<TranslationJobResponse>(
      ENDPOINTS.TRANSLATE_JOB_STATUS(jobId)
    );
    return response.data;
  },

  /**
   * Get paginated single-image translation history (server-side)
   */
  getTranslationHistory: async (options?: {
    limit?: number;
    offset?: number;
  }): Promise<TranslationHistoryResponse> => {
    const response = await apiClient.get<TranslationHistoryResponse>(
      ENDPOINTS.TRANSLATE_HISTORY,
      {
        params: {
          limit: options?.limit ?? 50,
          offset: options?.offset ?? 0,
        },
      }
    );
    return response.data;
  },
};
