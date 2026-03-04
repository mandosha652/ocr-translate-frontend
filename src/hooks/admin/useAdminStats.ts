'use client';

import { useQuery } from '@tanstack/react-query';

import { adminApi } from '@/lib/api/admin';

import { adminEnabled } from './adminEnabled';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats(),
    enabled: adminEnabled(),
    staleTime: 30 * 1000,
  });
}
