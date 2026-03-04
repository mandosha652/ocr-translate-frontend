'use client';

import { useMutation } from '@tanstack/react-query';

import { translateApi } from '@/lib/api';

export function useSubmitTranslationJob() {
  return useMutation({
    mutationFn: ({
      input,
      targetLanguage,
      options,
    }: {
      input: { file: File } | { imageUrl: string };
      targetLanguage: string;
      options?: { sourceLanguage?: string };
    }) => translateApi.submitTranslationJob(input, targetLanguage, options),
  });
}
