export interface AdminUserSummary {
  id: string;
  email: string;
  name: string | null;
  tier: 'free' | 'pro' | 'business' | 'enterprise';
  user_type: 'customer' | 'team';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AdminUserDetail extends AdminUserSummary {
  updated_at: string;
  api_key_count: number;
  total_batches: number;
  total_images_processed: number;
  total_translations: number;
  last_activity: string | null;
}

export interface AdminCreateUser {
  email: string;
  password: string;
  name?: string;
  tier?: 'free' | 'pro' | 'business' | 'enterprise';
  user_type?: 'customer' | 'team';
  is_verified?: boolean;
}

export interface AdminUpdateUser {
  tier?: 'free' | 'pro' | 'business' | 'enterprise';
  user_type?: 'customer' | 'team';
  is_active?: boolean;
  is_verified?: boolean;
  name?: string;
}

export interface AdminImpersonateResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  expires_in_seconds: number;
}

export interface AdminResendVerificationResponse {
  queued: boolean;
  detail: string;
}

export interface AdminApiKey {
  id: string;
  name: string;
  prefix: string;
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface AdminQueuedResponse {
  queued: boolean;
  detail: string;
}

export interface AdminBatchImage {
  id: string;
  original_filename: string;
  status: string;
  error: string | null;
  translation_count: number;
  created_at: string;
}

export interface AdminBatchSummary {
  id: string;
  tenant_id: string;
  status: string;
  source_language: string;
  target_languages: string[];
  total_images: number;
  completed_count: number;
  failed_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminBatchDetail extends AdminBatchSummary {
  webhook_url: string | null;
  images: AdminBatchImage[];
}

export interface TierBreakdown {
  free: number;
  pro: number;
  business: number;
  enterprise: number;
}

export interface AdminPlatformStats {
  total_users: number;
  active_users: number;
  verified_users: number;
  new_users_today: number;
  new_users_this_month: number;
  users_by_tier: TierBreakdown;
  total_batches: number;
  batches_today: number;
  pending_batches: number;
  processing_batches: number;
  failed_batches_today: number;
  total_images_processed: number;
  total_translations: number;
  images_processed_today: number;
  translations_today: number;
  ocr_calls_today: number;
  translate_calls_today: number;
  inpaint_calls_today: number;
}

export interface AdminPaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  items: T[];
}

export interface AdminVisionCostDetail {
  calls: number;
  cost_usd: number;
}

export interface AdminOpenAICostDetail {
  cost_usd: number | null;
  error?: string;
}

export interface AdminReplicateCostDetail {
  cost_usd: number | null;
  predictions: number;
  total_seconds?: number;
  error?: string;
}

export interface AdminCostSummary {
  period_start: string;
  period_end: string;
  total_cost_usd: number;
  vision: AdminVisionCostDetail;
  openai: AdminOpenAICostDetail;
  replicate: AdminReplicateCostDetail;
}

export interface AdminDailyCostEntry {
  date: string;
  vision_cost_usd: number;
  openai_cost_usd: number | null;
  replicate_cost_usd: number | null;
  total_cost_usd: number;
}

export interface AdminUserCostRow {
  user_id: string;
  images_processed: number;
  ocr_calls: number;
  translate_calls: number;
  inpaint_calls: number;
  vision_cost_usd: number;
}

export interface ServiceHealthResult {
  name: string;
  reachable: boolean;
  latency_ms: number | null;
  error?: string;
}

export interface AdminHealthServicesResponse {
  checked_at: string;
  services: ServiceHealthResult[];
}

export interface AdminCleanupResult {
  ran_at: string;
  batches_expired: number;
  singles_expired: number;
  triggered_by: string;
}

export interface AdminDevResetResponse {
  batches_deleted: number;
  single_translations_deleted: number;
  usage_logs_deleted: number;
  r2_files_deleted: number;
  r2_errors: number;
  queues_purged: number;
  local_files_deleted: number;
}

export interface AdminTenantFilesWipeResponse {
  tenant_id: string;
  files_deleted: number;
  errors: number;
}

export interface AppHealthResponse {
  status: string;
  broker: {
    status: string;
    reachable: boolean;
    error?: string;
  };
}
