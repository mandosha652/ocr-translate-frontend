'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import type { ApiKeyCreateRequest } from '@/types';

export function useApiKeys() {
  return useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => authApi.listApiKeys(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApiKeyCreateRequest) => authApi.createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => authApi.revokeApiKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });
}
