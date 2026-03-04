'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminApi } from '@/lib/api/admin';

import { adminEnabled } from './adminEnabled';

export function useAdminLastCleanupRun() {
  return useQuery({
    queryKey: ['admin', 'cleanup', 'last-run'],
    queryFn: () => adminApi.getLastCleanupRun(),
    enabled: adminEnabled(),
  });
}

export function useAdminRunCleanup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminApi.runCleanup(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cleanup'] });
    },
  });
}

export function useAdminWipeTenantFiles() {
  return useMutation({
    mutationFn: (tenantId: string) => adminApi.wipeTenantFiles(tenantId),
  });
}
