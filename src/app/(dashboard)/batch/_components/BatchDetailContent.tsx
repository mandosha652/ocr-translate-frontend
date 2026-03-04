'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  useBatchStatus,
  useBatchStream,
  useCancelBatch,
  useRetryBatchImage,
} from '@/hooks';
import { getErrorMessage } from '@/lib/utils';
import type { BatchStatusResponse } from '@/types';

import { BatchDetailHeader } from './BatchDetailHeader';
import { BatchDetailImages } from './BatchDetailImages';
import { BatchDetailProgress } from './BatchDetailProgress';

interface BatchDetailContentProps {
  batchId: string;
}

export function BatchDetailContent({ batchId }: BatchDetailContentProps) {
  const queryClient = useQueryClient();
  const cancelBatch = useCancelBatch();
  const retryImage = useRetryBatchImage();

  const { data: batch, isLoading, isError } = useBatchStatus(batchId);

  const isActive =
    batch?.status === 'pending' || batch?.status === 'processing';
  const { progress } = useBatchStream(batchId, !!isActive);

  const onDoneRef = useRef(() => {
    queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
  });

  useEffect(() => {
    if (progress?.done) {
      onDoneRef.current();
    }
  }, [progress?.done]);

  const merged: BatchStatusResponse | undefined = batch
    ? progress
      ? {
          ...batch,
          status: progress.status as BatchStatusResponse['status'],
          completed_count: progress.completed_count,
          failed_count: progress.failed_count,
        }
      : batch
    : undefined;

  const handleCancel = async () => {
    try {
      await cancelBatch.mutateAsync(batchId);
      toast.success('Batch cancelled');
      queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Couldn't cancel the batch — please try again")
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !merged) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <AlertCircle className="text-muted-foreground h-8 w-8" />
        <p className="text-muted-foreground text-sm">
          Couldn&apos;t load this batch
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/history">Back to history</Link>
        </Button>
      </div>
    );
  }

  const isExpired = merged.is_expired;
  const isProcessing =
    merged.status === 'pending' || merged.status === 'processing';
  const progressValue =
    merged.total_images > 0
      ? Math.round(
          ((merged.completed_count + merged.failed_count) /
            merged.total_images) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      <BatchDetailHeader
        batch={merged}
        isProcessing={isProcessing}
        isExpired={isExpired}
        onCancel={handleCancel}
        isCancelling={cancelBatch.isPending}
      />

      {isProcessing && (
        <BatchDetailProgress
          completedCount={merged.completed_count}
          failedCount={merged.failed_count}
          totalImages={merged.total_images}
          progressValue={progressValue}
        />
      )}

      <BatchDetailImages
        batch={merged}
        batchId={batchId}
        isProcessing={isProcessing}
        isExpired={isExpired}
        onRetry={imageId => retryImage.mutate({ batchId, imageId })}
        onRetryAll={imageIds =>
          imageIds.forEach(imageId => retryImage.mutate({ batchId, imageId }))
        }
        isRetrying={retryImage.isPending}
        retryingImageId={retryImage.variables?.imageId}
      />
    </div>
  );
}
