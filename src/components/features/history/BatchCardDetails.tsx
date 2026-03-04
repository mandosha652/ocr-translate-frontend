'use client';

import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useRetryBatchImage } from '@/hooks';
import type { BatchStatusResponse } from '@/types';

import { BatchImageTile } from './BatchImageTile';

interface BatchCardDetailsProps {
  batch: BatchStatusResponse;
  batchId: string;
}

export function BatchCardDetails({ batch, batchId }: BatchCardDetailsProps) {
  const retryImage = useRetryBatchImage();

  const completedImages = batch.images.filter(i => i.status === 'completed');
  const failedImages = batch.images.filter(i => i.status === 'failed');
  const isExpired = batch.is_expired;

  return (
    <>
      {isExpired && (
        <p className="text-muted-foreground text-sm">
          Image results have expired and are no longer available for download.
        </p>
      )}
      {!isExpired && completedImages.length > 0 && (
        <div className="space-y-3">
          {failedImages.length > 0 && (
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Completed ({completedImages.length})
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {completedImages.map(img => (
              <BatchImageTile
                key={img.image_id}
                image={img}
                onRetry={() =>
                  retryImage.mutate({
                    batchId,
                    imageId: img.image_id,
                  })
                }
                isRetrying={
                  retryImage.isPending &&
                  retryImage.variables?.imageId === img.image_id
                }
              />
            ))}
          </div>
        </div>
      )}

      {!isExpired && failedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Failed ({failedImages.length})
            </p>
            {failedImages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-1 px-2 py-1 text-xs"
                onClick={() =>
                  failedImages.forEach(img =>
                    retryImage.mutate({
                      batchId,
                      imageId: img.image_id,
                    })
                  )
                }
                disabled={retryImage.isPending}
              >
                <RefreshCw className="h-3 w-3" /> Retry all
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {failedImages.map(img => (
              <BatchImageTile
                key={img.image_id}
                image={img}
                onRetry={() =>
                  retryImage.mutate({
                    batchId,
                    imageId: img.image_id,
                  })
                }
                isRetrying={
                  retryImage.isPending &&
                  retryImage.variables?.imageId === img.image_id
                }
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
