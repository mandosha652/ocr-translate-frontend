'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { translateApi } from '@/lib/api';

export function useUpdateCaption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batchId,
      imageId,
      lang,
      caption,
    }: {
      batchId: string;
      imageId: string;
      lang: string;
      caption: string;
    }) => translateApi.updateCaption(batchId, imageId, lang, caption),
    onSuccess: (_data, { batchId }) => {
      queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
    },
  });
}
