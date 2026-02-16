'use client';

import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Ban,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { BatchStatusResponse, BatchStatus, ImageStatus } from '@/types';

interface BatchProgressProps {
  batchStatus: BatchStatusResponse;
  onCancel: () => void;
  isCancelling: boolean;
}

const statusConfig: Record<
  BatchStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  pending: { label: 'Pending', variant: 'secondary', icon: Clock },
  processing: { label: 'Processing', variant: 'default', icon: Loader2 },
  completed: { label: 'Completed', variant: 'default', icon: CheckCircle2 },
  partially_completed: {
    label: 'Partially Completed',
    variant: 'secondary',
    icon: AlertCircle,
  },
  failed: { label: 'Failed', variant: 'destructive', icon: XCircle },
  cancelled: { label: 'Cancelled', variant: 'outline', icon: Ban },
};

const imageStatusConfig: Record<
  ImageStatus,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  pending: { icon: Clock, color: 'text-muted-foreground' },
  processing: { icon: Loader2, color: 'text-primary' },
  completed: { icon: CheckCircle2, color: 'text-green-500' },
  failed: { icon: XCircle, color: 'text-destructive' },
};

export function BatchProgress({
  batchStatus,
  onCancel,
  isCancelling,
}: BatchProgressProps) {
  const { status, total_images, completed_count, failed_count, images } =
    batchStatus;

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const progressValue =
    total_images > 0
      ? Math.round(((completed_count + failed_count) / total_images) * 100)
      : 0;

  const isProcessing = status === 'pending' || status === 'processing';
  const isFinished =
    status === 'completed' ||
    status === 'partially_completed' ||
    status === 'failed' ||
    status === 'cancelled';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIcon
            className={cn(
              'h-5 w-5',
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
        <Badge variant={config.variant} className="gap-1.5">
          {config.label}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-medium">
            {completed_count} completed · {failed_count} failed ·{' '}
            {total_images - completed_count - failed_count} remaining
          </span>
          <span className="font-semibold">{progressValue}%</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {failed_count > 0 && (
        <div className="text-destructive flex items-center gap-2 text-sm">
          <XCircle className="h-4 w-4" />
          <span>{failed_count} image(s) failed</span>
        </div>
      )}

      <div className="max-h-48 space-y-2 overflow-y-auto">
        {images.map(image => {
          const imgConfig = imageStatusConfig[image.status];
          const ImgIcon = imgConfig.icon;

          return (
            <div
              key={image.image_id}
              className="bg-muted/50 flex items-center justify-between rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <ImgIcon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    imgConfig.color,
                    image.status === 'processing' && 'animate-spin'
                  )}
                />
                <span className="truncate text-sm">
                  {image.original_filename}
                </span>
              </div>
              {image.error && (
                <span className="text-destructive ml-2 truncate text-xs">
                  {image.error}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {isProcessing && (
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
      )}

      {isFinished && (
        <p className="text-muted-foreground text-center text-sm">
          Batch{' '}
          {status === 'cancelled' ? 'was cancelled' : 'processing finished'}
        </p>
      )}
    </div>
  );
}
