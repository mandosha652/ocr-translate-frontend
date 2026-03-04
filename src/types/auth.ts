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

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

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

export interface ApiKeyRenameRequest {
  name: string;
}

export interface ApiKeyRenameResponse {
  success: boolean;
  id: string;
  name: string;
}

export interface ApiKeyStatsResponse {
  key_id: string;
  total_images: number;
  total_translations: number;
  total_requests: number;
  last_used_at: string | null;
}
