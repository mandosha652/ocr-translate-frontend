import type { BatchStatus, ImageResult } from './batch';

export interface TeamLoginResponse {
  access_token: string;
  token_type: string;
}

export interface TeamBatchCreateResponse {
  batch_id: string;
  image_count: number;
  source_language: string;
  target_languages: string[];
  status: BatchStatus;
}

export interface TeamBatchSummary {
  batch_id: string;
  status: BatchStatus;
  total_images: number;
  completed_count: number;
  failed_count: number;
  source_language: string;
  target_languages: string[];
  created_at: string;
}

export interface TeamBatchListResponse {
  batches: TeamBatchSummary[];
  total: number;
  limit: number;
  offset: number;
}

export type CaptionsStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface TeamBatchStatus extends TeamBatchSummary {
  captions_status: CaptionsStatus;
  total_translations?: number;
  completed_translations?: number;
  images?: ImageResult[];
}

export interface TeamBatchCancelResponse {
  batch_id: string;
  status: BatchStatus;
  message: string;
}

export interface TeamQuickTranslateResponse {
  batch_id: string;
  image_count: number;
  status: BatchStatus;
}
