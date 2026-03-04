'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { translateApi } from '@/lib/api';

export function useRetryBatchImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, imageId }: { batchId: string; imageId: string }) =>
      translateApi.retryBatchImage(batchId, imageId),
    onSuccess: (_data, { batchId }) => {
      queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
    },
  });
}
