'use client';

import { AlertCircle, ImageIcon, Loader2 } from 'lucide-react';

import { BatchImageTile } from '@/components/features/history/BatchImageTile';
import type { BatchStatusResponse } from '@/types';

interface BatchDetailImagesProps {
  batch: BatchStatusResponse;
  batchId: string;
  isProcessing: boolean;
  isExpired: boolean;
  onRetry: (imageId: string) => void;
  onRetryAll: (imageIds: string[]) => void;
  isRetrying: boolean;
  retryingImageId: string | undefined;
}

export function BatchDetailImages({
  batch,
  batchId: _batchId,
  isProcessing,
  isExpired,
  onRetry,
  onRetryAll,
  isRetrying,
  retryingImageId,
}: BatchDetailImagesProps) {
  const completedImages = batch.images.filter(i => i.status === 'completed');
  const failedImages = batch.images.filter(i => i.status === 'failed');
  const pendingImages = batch.images.filter(
    i => i.status === 'pending' || i.status === 'processing'
  );

  return (
    <>
      {/* Expired notice */}
      {isExpired && (
        <div className="text-muted-foreground flex items-center gap-2 rounded-lg border px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Image results have expired and are no longer available for download.
        </div>
      )}

      {/* In-progress images */}
      {isProcessing && pendingImages.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            In Progress ({pendingImages.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {pendingImages.map(img => (
              <div
                key={img.image_id}
                className="bg-card flex flex-col items-center justify-center gap-2 rounded-xl border p-4"
              >
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                  <ImageIcon className="text-muted-foreground h-5 w-5" />
                </div>
                <p
                  className="text-muted-foreground max-w-full truncate text-xs"
                  title={img.original_filename}
                >
                  {img.original_filename}
                </p>
                <Loader2 className="text-primary h-4 w-4 animate-spin" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed images */}
      {!isExpired && completedImages.length > 0 && (
        <section className="space-y-3">
          {(failedImages.length > 0 || isProcessing) && (
            <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Completed ({completedImages.length})
            </h2>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {completedImages.map(img => (
              <BatchImageTile
                key={img.image_id}
                image={img}
                onRetry={() => onRetry(img.image_id)}
                isRetrying={isRetrying && retryingImageId === img.image_id}
              />
            ))}
          </div>
        </section>
      )}

      {/* Failed images */}
      {!isExpired && failedImages.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Failed ({failedImages.length})
            </h2>
            {failedImages.length > 1 && (
              <button
                onClick={() =>
                  onRetryAll(failedImages.map(img => img.image_id))
                }
                disabled={isRetrying}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex cursor-pointer items-center gap-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
              >
                Retry all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {failedImages.map(img => (
              <BatchImageTile
                key={img.image_id}
                image={img}
                onRetry={() => onRetry(img.image_id)}
                isRetrying={isRetrying && retryingImageId === img.image_id}
              />
            ))}
          </div>
        </section>
      )}

      {/* Expired placeholder grid */}
      {isExpired && batch.images.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Images ({batch.images.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {batch.images.map(img => (
              <div
                key={img.image_id}
                className="bg-card overflow-hidden rounded-xl border"
              >
                <div className="bg-muted flex aspect-square items-center justify-center">
                  <ImageIcon className="text-muted-foreground/40 h-8 w-8" />
                </div>
                <div className="p-2.5">
                  <p
                    className="truncate text-xs font-medium"
                    title={img.original_filename}
                  >
                    {img.original_filename}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">Expired</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
