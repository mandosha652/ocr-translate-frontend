'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { AdminBatchesParams } from '@/lib/api/admin';
import { adminApi } from '@/lib/api/admin';

import { adminEnabled } from './adminEnabled';

export function useAdminBatches(params: AdminBatchesParams = {}) {
  return useQuery({
    queryKey: ['admin', 'batches', params],
    queryFn: () => adminApi.listBatches(params),
    enabled: adminEnabled(),
  });
}

export function useAdminBatch(batchId: string) {
  return useQuery({
    queryKey: ['admin', 'batches', batchId],
    queryFn: () => adminApi.getBatch(batchId),
    enabled: adminEnabled() && !!batchId,
  });
}

export function useAdminDeleteBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (batchId: string) => adminApi.deleteBatch(batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'batches'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useAdminCancelBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (batchId: string) => adminApi.cancelBatch(batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'batches'] });
    },
  });
}

export function useAdminRetryBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (batchId: string) => adminApi.retryBatch(batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'batches'] });
    },
  });
}

export function useAdminResumeStuckBatches() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminApi.resumeStuckBatches(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'batches'] });
    },
  });
}

export function useAdminRetryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) => adminApi.retryImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'batches'] });
    },
  });
}
