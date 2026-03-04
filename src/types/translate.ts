export interface TranslateResponse {
  success: boolean;
  original_image_url: string;
  translated_image_url: string;
  clean_image_url: string | null;
  mask_url: string | null;
  regions: TextRegion[];
  target_lang: string;
  detected_source_lang: string | null;
  processing_time_ms: number;
}

export interface TextRegion {
  id: string;
  original_text: string;
  translated_text: string;
  bounding_box: BoundingBox;
  confidence: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TranslateErrorResponse {
  success: false;
  error: string;
  step: string;
  message: string;
}

export type TranslationJobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export interface TranslationJobResponse {
  id: string;
  status: TranslationJobStatus;
  output_url: string | null;
  error: string | null;
  target_lang: string;
  pipeline_mode: string;
  created_at: string;
}
