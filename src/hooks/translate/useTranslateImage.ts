'use client';

import { useMutation } from '@tanstack/react-query';

import { translateApi } from '@/lib/api';

interface TranslateImageOptions {
  sourceLang?: string;
  excludeText?: string;
}

export function useTranslateImage() {
  return useMutation({
    mutationFn: ({
      file,
      targetLang,
      options,
      signal,
    }: {
      file: File;
      targetLang: string;
      options?: TranslateImageOptions;
      signal?: AbortSignal;
    }) => translateApi.translateImage(file, targetLang, { ...options, signal }),
  });
}
