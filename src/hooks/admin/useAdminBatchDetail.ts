'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  useAdminBatch,
  useAdminCancelBatch,
  useAdminDeleteBatch,
  useAdminRetryBatch,
  useAdminRetryImage,
} from '@/hooks';

export function useAdminBatchDetail(id: string) {
  const router = useRouter();
  const { data: batch, isLoading, error, refetch } = useAdminBatch(id);
  const deleteBatch = useAdminDeleteBatch();
  const cancelBatch = useAdminCancelBatch();
  const retryBatch = useAdminRetryBatch();
  const retryImage = useAdminRetryImage();

  const handleDelete = async () => {
    try {
      await deleteBatch.mutateAsync(id);
      toast.success('Batch deleted');
      router.push('/admin/batches');
    } catch {
      toast.error('Failed to delete batch');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelBatch.mutateAsync(id);
      toast.success('Batch cancelled');
      refetch();
    } catch {
      toast.error('Failed to cancel batch');
    }
  };

  const handleRetry = async () => {
    try {
      await retryBatch.mutateAsync(id);
      toast.success('Batch queued for retry');
    } catch {
      toast.error('Failed to retry batch');
    }
  };

  const handleRetryImage = async (imageId: string) => {
    try {
      await retryImage.mutateAsync(imageId);
      toast.success('Image queued for retry');
      refetch();
    } catch {
      toast.error('Failed to retry image');
    }
  };

  const canCancel =
    batch?.status === 'pending' || batch?.status === 'processing';
  const canRetry =
    batch?.status === 'failed' ||
    batch?.status === 'partially_completed' ||
    batch?.status === 'cancelled';

  return {
    batch,
    isLoading,
    error,
    canCancel,
    canRetry,
    handleDelete,
    handleCancel,
    handleRetry,
    handleRetryImage,
    isPendingDelete: deleteBatch.isPending,
    isPendingCancel: cancelBatch.isPending,
    isPendingRetry: retryBatch.isPending,
    isPendingRetryImage: retryImage.isPending,
  };
}
