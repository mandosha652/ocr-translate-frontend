'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAdminBatchDetail } from '@/hooks/admin/useAdminBatchDetail';

import {
  BatchDetailHeader,
  BatchDetailImages,
  BatchDetailMetadata,
  BatchDetailProgress,
  BatchDetailStats,
} from './_components';

export default function AdminBatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    batch,
    isLoading,
    error,
    canCancel,
    canRetry,
    handleDelete,
    handleCancel,
    handleRetry,
    handleRetryImage,
    isPendingDelete,
    isPendingCancel,
    isPendingRetry,
    isPendingRetryImage,
  } = useAdminBatchDetail(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-muted h-8 w-8 animate-pulse rounded-lg" />
          <div>
            <div className="bg-muted mb-1.5 h-6 w-48 animate-pulse rounded" />
            <div className="bg-muted h-3.5 w-80 animate-pulse rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="bg-muted h-20 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <div className="bg-destructive/10 rounded-full p-3">
          <AlertTriangle className="text-destructive h-5 w-5" />
        </div>
        <p className="text-destructive font-semibold">Batch not found</p>
        <Link href="/admin/batches">
          <Button variant="outline" size="sm">
            Back to Batches
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BatchDetailHeader
        batchId={batch.id}
        status={batch.status}
        canCancel={canCancel}
        canRetry={canRetry}
        onCancel={handleCancel}
        onRetry={handleRetry}
        onDelete={handleDelete}
        isPendingDelete={isPendingDelete}
        isPendingCancel={isPendingCancel}
        isPendingRetry={isPendingRetry}
      />
      <BatchDetailStats
        totalImages={batch.total_images}
        completedCount={batch.completed_count}
        failedCount={batch.failed_count}
        targetLanguagesCount={batch.target_languages.length}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <BatchDetailMetadata
          tenantId={batch.tenant_id}
          sourceLanguage={batch.source_language}
          targetLanguages={batch.target_languages}
          webhookUrl={batch.webhook_url || undefined}
          createdAt={batch.created_at}
          updatedAt={batch.updated_at}
        />
        {(batch.failed_count > 0 || batch.status === 'partially_completed') && (
          <BatchDetailProgress
            completedCount={batch.completed_count}
            failedCount={batch.failed_count}
            totalImages={batch.total_images}
            showProgress
          />
        )}
      </div>
      <BatchDetailImages
        images={batch.images}
        onRetryImage={handleRetryImage}
        isRetrying={isPendingRetryImage}
      />
    </div>
  );
}
