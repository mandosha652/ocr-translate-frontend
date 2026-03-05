export type BatchStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'partially_completed'
  | 'failed'
  | 'cancelled';

export type ImageStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface TranslationOutput {
  target_lang: string;
  translated_image_url: string | null;
  status: ImageStatus;
  error: string | null;
}

export interface ImageResult {
  image_id: string;
  original_filename: string;
  status: ImageStatus;
  original_image_url: string | null;
  translations: TranslationOutput[];
  error: string | null;
}

export interface BatchCreateResponse {
  success: boolean;
  batch_id: string;
  status: BatchStatus;
  total_images: number;
  target_languages: string[];
  message: string;
}

export interface BatchStatusResponse {
  success: boolean;
  batch_id: string;
  status: BatchStatus;
  total_images: number;
  target_languages: string[];
  completed_count: number;
  failed_count: number;
  pending_count: number;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
  images: ImageResult[];
}

export interface BatchCancelResponse {
  success: boolean;
  batch_id: string;
  status: BatchStatus;
  message: string;
}

export interface SingleTranslationRecord {
  id: string;
  original_image_url: string;
  translated_image_url: string;
  source_lang: string | null;
  target_lang: string;
  processing_time_ms: number;
  is_expired: boolean;
  created_at: string;
}

export interface TranslationHistoryResponse {
  success: boolean;
  items: SingleTranslationRecord[];
  total: number;
  limit: number;
  offset: number;
}

export interface UsagePeriod {
  images_processed: number;
  translations_count: number;
  batches_run: number;
}

export interface UsageQuota {
  tier: string;
  images_limit: number | null;
  translations_limit: number | null;
  batches_limit: number | null;
  images_per_batch: number;
  images_used: number;
  translations_used: number;
  batches_used: number;
}

export interface UsageStatsResponse {
  current_month: UsagePeriod;
  last_month: UsagePeriod;
  all_time: UsagePeriod;
  quota: UsageQuota;
  most_used_languages: string[];
  last_activity: string | null;
}
