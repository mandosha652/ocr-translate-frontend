'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { translateApi } from '@/lib/api';

interface CreateBatchOptions {
  sourceLanguage?: string;
  excludeText?: string;
  webhookUrl?: string;
}

export function useCreateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      input,
      targetLanguages,
      options,
    }: {
      input: { files: File[] } | { imageUrls: string[] };
      targetLanguages: string[];
      options?: CreateBatchOptions;
    }) => translateApi.createBatch(input, targetLanguages, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}
