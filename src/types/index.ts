// =============================================================================
// User & Authentication Types
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  tier: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  user: User;
  api_key: string;
  tokens: AuthTokens;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// =============================================================================
// API Key Types
// =============================================================================

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface ApiKeyCreateRequest {
  name?: string;
  expires_in_days?: number;
}

export interface ApiKeyCreateResponse {
  success: boolean;
  api_key: ApiKey;
  key: string;
}

export interface ApiKeyListResponse {
  success: boolean;
  api_keys: ApiKey[];
}

// =============================================================================
// Translation Types
// =============================================================================

export interface TranslateResponse {
  success: boolean;
  original_image_url: string;
  translated_image_url: string;
  clean_image_url: string | null;
  mask_url: string | null;
  regions: TextRegion[];
  target_lang: string;
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

// =============================================================================
// Batch Translation Types
// =============================================================================

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

export interface BatchCreateRequest {
  files: File[];
  source_language?: string;
  target_languages: string;
  exclude_text?: string;
  webhook_url?: string;
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

// =============================================================================
// Common Types
// =============================================================================

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  detail?: string;
}

// =============================================================================
// Language Types
// =============================================================================

export interface Language {
  code: string;
  name: string;
}

// Languages supported by backend - MUST match backend's app/core/languages.py
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
];
