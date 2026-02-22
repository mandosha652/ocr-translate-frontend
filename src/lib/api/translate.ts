import apiClient from './client';
import { ENDPOINTS } from '@/lib/constants';
import type {
  TranslateResponse,
  BatchCreateResponse,
  BatchStatusResponse,
  BatchCancelResponse,
  TranslationHistoryResponse,
} from '@/types';

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
    files: File[],
    targetLanguages: string[],
    options?: {
      sourceLanguage?: string;
      excludeText?: string;
      webhookUrl?: string;
    }
  ): Promise<BatchCreateResponse> => {
    const formData = new FormData();

    // Append all files
    files.forEach(file => {
      formData.append('files', file);
    });

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
