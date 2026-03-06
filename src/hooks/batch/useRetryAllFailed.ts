'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { translateApi } from '@/lib/api';

export function useRetryAllFailed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId: string) => translateApi.retryAllFailed(batchId),
    onSuccess: (_data, batchId) => {
      queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
    },
  });
}
