'use client';

import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BATCH_STATUS_CONFIG } from '@/lib/constants/ui';
import { cn } from '@/lib/utils';
import type { BatchStatus, BatchStatusResponse } from '@/types';

import { ImageStatusList } from './ImageStatusList';
import { ProgressBar } from './ProgressBar';

interface BatchProgressProps {
  batchStatus: BatchStatusResponse;
  onCancel: () => void;
  isCancelling: boolean;
}

const STATUS_ICONS: Record<
  BatchStatus,
  React.ComponentType<{ className?: string }>
> = {
  pending: Clock,
  processing: Loader2,
  completed: CheckCircle2,
  partially_completed: AlertCircle,
  failed: XCircle,
  cancelled: Ban,
};

export function BatchProgress({
  batchStatus,
  onCancel,
  isCancelling,
}: BatchProgressProps) {
  const { status, total_images, completed_count, failed_count, images } =
    batchStatus;

  const config = BATCH_STATUS_CONFIG[status];
  const StatusIcon = STATUS_ICONS[status];

  const progressValue =
    total_images > 0
      ? Math.round(((completed_count + failed_count) / total_images) * 100)
      : 0;

  const isProcessing = status === 'pending' || status === 'processing';

  const estimatedTimeRemaining = useMemo(() => {
    if (!isProcessing) return null;
    const processed = completed_count + failed_count;
    if (processed === 0) return null;
    const updatedAt = batchStatus.updated_at
      ? Date.parse(batchStatus.updated_at)
      : null;
    const createdAt = Date.parse(batchStatus.created_at);
    const elapsedMs = updatedAt ? updatedAt - createdAt : 0;
    if (elapsedMs <= 0) return null;
    const msPerImage = elapsedMs / processed;
    const etaMs = msPerImage * (total_images - processed);
    if (etaMs < 5000) return 'almost done';
    const etaSec = Math.ceil(etaMs / 1000);
    if (etaSec < 60) return `~${etaSec}s remaining`;
    return `~${Math.ceil(etaSec / 60)}m remaining`;
  }, [
    isProcessing,
    completed_count,
    failed_count,
    total_images,
    batchStatus.created_at,
    batchStatus.updated_at,
  ]);

  const isFinished =
    status === 'completed' ||
    status === 'partially_completed' ||
    status === 'failed' ||
    status === 'cancelled';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <StatusIcon
            className={cn(
              'h-5 w-5 shrink-0',
              status === 'processing' && 'text-primary animate-spin',
              status === 'pending' && 'text-muted-foreground',
              status === 'completed' && 'text-green-500',
              status === 'partially_completed' && 'text-amber-500',
              status === 'failed' && 'text-destructive',
              status === 'cancelled' && 'text-muted-foreground'
            )}
          />
          <div>
            <h3 className="font-semibold">Batch Translation</h3>
            <p className="text-muted-foreground text-sm">
              {isProcessing
                ? `Processing ${completed_count + failed_count} of ${total_images} images...`
                : `${completed_count} of ${total_images} completed`}
            </p>
          </div>
        </div>
        <Badge variant={config.variant} className="shrink-0 gap-1.5">
          {config.label}
        </Badge>
      </div>

      <ProgressBar
        progressValue={progressValue}
        completedCount={completed_count}
        failedCount={failed_count}
        totalImages={total_images}
        estimatedTimeRemaining={estimatedTimeRemaining}
      />

      {failed_count > 0 && (
        <div className="text-destructive flex items-center gap-2 text-sm">
          <XCircle className="h-4 w-4" />
          <span>{failed_count} image(s) failed</span>
        </div>
      )}

      <ImageStatusList images={images} />

      {isProcessing ? (
        <Button
          variant="destructive"
          className="w-full"
          onClick={onCancel}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            'Cancel Batch'
          )}
        </Button>
      ) : null}

      {isFinished ? (
        <p className="text-muted-foreground text-center text-sm">
          Batch{' '}
          {status === 'cancelled' ? 'was cancelled' : 'processing finished'}
        </p>
      ) : null}
    </div>
  );
}
