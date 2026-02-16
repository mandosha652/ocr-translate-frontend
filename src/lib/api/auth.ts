import apiClient, { tokenStorage } from './client';
import { ENDPOINTS } from '@/lib/constants';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  AuthTokens,
  ApiKey,
  ApiKeyCreateRequest,
  ApiKeyCreateResponse,
  ApiKeyListResponse,
  MessageResponse,
} from '@/types';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      ENDPOINTS.REGISTER,
      data
    );
    // Store tokens
    tokenStorage.setTokens(response.data.tokens);
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(ENDPOINTS.LOGIN, data);
    // Store tokens
    tokenStorage.setTokens(response.data.tokens);
    return response.data;
  },

  /**
   * Logout - clear tokens
   */
  logout: (): void => {
    tokenStorage.clearTokens();
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<AuthTokens> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthTokens>(ENDPOINTS.REFRESH, {
      refresh_token: refreshToken,
    });
    tokenStorage.setTokens(response.data);
    return response.data;
  },

  /**
   * Get current user info
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>(ENDPOINTS.ME);
    return response.data;
  },

  /**
   * Create a new API key
   */
  createApiKey: async (
    data: ApiKeyCreateRequest = {}
  ): Promise<ApiKeyCreateResponse> => {
    const response = await apiClient.post<ApiKeyCreateResponse>(
      ENDPOINTS.API_KEYS,
      data
    );
    return response.data;
  },

  /**
   * List all API keys
   */
  listApiKeys: async (): Promise<ApiKey[]> => {
    const response = await apiClient.get<ApiKeyListResponse>(
      ENDPOINTS.API_KEYS
    );
    return response.data.api_keys;
  },

  /**
   * Revoke an API key
   */
  revokeApiKey: async (keyId: string): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(
      `${ENDPOINTS.API_KEYS}/${keyId}`
    );
    return response.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenStorage.hasTokens();
  },
};
