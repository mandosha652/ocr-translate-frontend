'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

import { FREE_TIER_MAX_TARGET_LANGUAGES } from '@/lib/constants';
import { getErrorMessage, getErrorStatus } from '@/lib/utils/error';
import { isValidHttpUrl } from '@/lib/utils/url';

import { useCreateBatch } from './useCreateBatch';

type InputMode = 'upload' | 'url';

interface UseBatchFormSubmitArgs {
  inputMode: InputMode;
  files: File[];
  imageUrls: string[];
  targetLanguages: string[];
  sourceLang: string;
  excludeText: string;
  webhookUrl: string;
  isWebhookValid: boolean;
  activeBatchCount: number;
  maxConcurrentBatches?: number;
  maxTargetLanguages?: number;
  onBatchStarted: () => void;
  onUpgradeRequired: () => void;
  resetForm: () => void;
}

function requestNotificationPermission() {
  if (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    Notification.permission === 'default'
  ) {
    Notification.requestPermission();
  }
}

export function useBatchFormSubmit({
  inputMode,
  files,
  imageUrls,
  targetLanguages,
  sourceLang,
  excludeText,
  webhookUrl,
  isWebhookValid,
  activeBatchCount,
  maxConcurrentBatches = 1,
  maxTargetLanguages = FREE_TIER_MAX_TARGET_LANGUAGES,
  onBatchStarted,
  onUpgradeRequired,
  resetForm,
}: UseBatchFormSubmitArgs) {
  const createBatchMutation = useCreateBatch();

  const validUrls = imageUrls.filter(u => u.trim() && isValidHttpUrl(u.trim()));
  const hasInput =
    inputMode === 'upload' ? files.length > 0 : validUrls.length > 0;

  const handleStartBatch = useCallback(async () => {
    if (!hasInput) {
      toast.error(
        inputMode === 'upload'
          ? 'Add at least one image to start'
          : 'Add at least one valid image URL to start'
      );
      return;
    }
    if (targetLanguages.length === 0) {
      toast.error('Choose at least one target language');
      return;
    }
    if (targetLanguages.length > maxTargetLanguages) {
      toast.error(
        `You can only select up to ${maxTargetLanguages} languages at once`
      );
      return;
    }
    if (activeBatchCount >= maxConcurrentBatches) {
      toast.error('Too many active batches — wait for one to finish');
      return;
    }
    if (webhookUrl.trim() && !isWebhookValid) {
      toast.error('Enter a valid webhook URL (e.g. https://…)');
      return;
    }
    const input = inputMode === 'upload' ? { files } : { imageUrls: validUrls };
    try {
      const response = await createBatchMutation.mutateAsync({
        input,
        targetLanguages,
        options: {
          sourceLanguage: sourceLang !== 'auto' ? sourceLang : undefined,
          excludeText: excludeText || undefined,
          webhookUrl: webhookUrl.trim() || undefined,
        },
      });
      toast.success(
        `Batch started — ${response.total_images} image${response.total_images !== 1 ? 's' : ''} queued`
      );
      requestNotificationPermission();
      resetForm();
      onBatchStarted();
    } catch (error) {
      const status = getErrorStatus(error);
      if (status === 402 || status === 429) {
        onUpgradeRequired();
        return;
      }
      toast.error(
        getErrorMessage(error, "Couldn't start the batch — please try again")
      );
    }
  }, [
    hasInput,
    inputMode,
    files,
    validUrls,
    targetLanguages,
    sourceLang,
    excludeText,
    webhookUrl,
    isWebhookValid,
    activeBatchCount,
    maxConcurrentBatches,
    maxTargetLanguages,
    createBatchMutation,
    resetForm,
    onBatchStarted,
    onUpgradeRequired,
  ]);

  return {
    handleStartBatch,
    isPending: createBatchMutation.isPending,
    hasInput,
  };
}
