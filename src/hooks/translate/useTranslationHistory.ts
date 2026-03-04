'use client';

import { useQuery } from '@tanstack/react-query';

import { translateApi } from '@/lib/api';

export function useTranslationHistory(options?: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: [
      'translationHistory',
      options?.limit ?? 50,
      options?.offset ?? 0,
    ],
    queryFn: () =>
      translateApi.getTranslationHistory({
        limit: options?.limit ?? 50,
        offset: options?.offset ?? 0,
      }),
    staleTime: 30 * 1000,
  });
}
