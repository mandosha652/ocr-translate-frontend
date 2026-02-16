'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    }: {
      file: File;
      targetLang: string;
      options?: TranslateImageOptions;
    }) => translateApi.translateImage(file, targetLang, options),
  });
}

interface CreateBatchOptions {
  sourceLanguage?: string;
  excludeText?: string;
  webhookUrl?: string;
}

export function useCreateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      files,
      targetLanguages,
      options,
    }: {
      files: File[];
      targetLanguages: string[];
      options?: CreateBatchOptions;
    }) => translateApi.createBatch(files, targetLanguages, options),
    onSuccess: () => {
      // Invalidate batches query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function useBatchStatus(
  batchId: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['batch', batchId],
    queryFn: () => translateApi.getBatchStatus(batchId!),
    enabled: !!batchId && (options?.enabled ?? true),
    refetchInterval: query => {
      // Poll every 2 seconds while processing
      const status = query.state.data?.status;
      if (status === 'pending' || status === 'processing') {
        return 2000;
      }
      return false;
    },
  });
}

export function useCancelBatch() {
  return useMutation({
    mutationFn: (batchId: string) => translateApi.cancelBatch(batchId),
  });
}

export function useListBatches(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['batches'],
    queryFn: () => translateApi.listBatches(),
    enabled: options?.enabled ?? true,
    refetchInterval: query => {
      const data = query.state.data;
      const hasActiveBatches = data?.some(
        b => b.status === 'pending' || b.status === 'processing'
      );
      return hasActiveBatches ? 5000 : false;
    },
  });
}
