'use client';

import { useQuery } from '@tanstack/react-query';

import { adminApi } from '@/lib/api/admin';

import { adminEnabled } from './adminEnabled';

export function useAdminHealth() {
  return useQuery({
    queryKey: ['admin', 'health'],
    queryFn: () => adminApi.getHealth(),
    enabled: adminEnabled(),
    staleTime: 0,
  });
}

export function useAdminHealthServices() {
  return useQuery({
    queryKey: ['admin', 'health', 'services'],
    queryFn: () => adminApi.getHealthServices(),
    enabled: adminEnabled(),
    staleTime: 0,
  });
}
