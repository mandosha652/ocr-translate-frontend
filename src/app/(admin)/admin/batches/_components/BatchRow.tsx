'use client';

import { format } from 'date-fns';
import { ExternalLink, RotateCcw, Trash2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  useAdminCancelBatch,
  useAdminDeleteBatch,
  useAdminRetryBatch,
} from '@/hooks';
import { ADMIN_BATCH_STATUS_CONFIG } from '@/lib/constants/admin';
import type { AdminBatchSummary } from '@/types';

import { StatusBadge } from './StatusBadge';

export function BatchRow({ batch }: { batch: AdminBatchSummary }) {
  const deleteBatch = useAdminDeleteBatch();
  const cancelBatch = useAdminCancelBatch();
  const retryBatch = useAdminRetryBatch();

  const handleDelete = async () => {
    try {
      await deleteBatch.mutateAsync(batch.id);
      toast.success('Batch deleted');
    } catch {
      toast.error('Failed to delete batch');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelBatch.mutateAsync(batch.id);
      toast.success('Batch cancelled');
    } catch {
      toast.error('Failed to cancel batch');
    }
  };

  const handleRetry = async () => {
    try {
      await retryBatch.mutateAsync(batch.id);
      toast.success('Batch queued for retry');
    } catch {
      toast.error('Failed to retry batch');
    }
  };

  const canCancel = batch.status === 'pending' || batch.status === 'processing';
  const canRetry =
    batch.status === 'failed' ||
    batch.status === 'partially_completed' ||
    batch.status === 'cancelled';

  const dot =
    ADMIN_BATCH_STATUS_CONFIG[batch.status]?.dot ?? 'bg-muted-foreground/30';

  return (
    <div className="hover:bg-muted/30 flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors">
      <div className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground truncate font-mono text-xs">
            {batch.id}
          </p>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm">
            {batch.source_language} →{' '}
            {batch.target_languages.slice(0, 3).join(', ')}
            {batch.target_languages.length > 3 &&
              ` +${batch.target_languages.length - 3}`}
          </span>
          <span className="text-muted-foreground text-xs">
            {batch.total_images} img · {batch.completed_count} done
            {batch.failed_count > 0 && (
              <span className="text-red-500">
                {' '}
                · {batch.failed_count} failed
              </span>
            )}
          </span>
          <Link
            href={`/admin/users/${batch.tenant_id}`}
            className="text-muted-foreground hover:text-foreground font-mono text-xs transition-colors"
            title="View user"
          >
            {batch.tenant_id.slice(0, 8)}…
          </Link>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <StatusBadge status={batch.status} />
        <span className="text-muted-foreground hidden text-xs tabular-nums sm:block">
          {format(new Date(batch.created_at), 'MMM d, yyyy')}
        </span>

        <div className="flex items-center">
          <Link href={`/admin/batches/${batch.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8"
              title="View detail"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
          {canCancel ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-8 w-8 hover:text-orange-500"
              title="Cancel batch"
              disabled={cancelBatch.isPending}
              onClick={handleCancel}
            >
              <XCircle className="h-3.5 w-3.5" />
            </Button>
          ) : null}
          {canRetry ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-8 w-8 hover:text-blue-500"
              title="Retry batch"
              disabled={retryBatch.isPending}
              onClick={handleRetry}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          ) : null}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive h-8 w-8"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this batch?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes the batch and all its image results.
                  Cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteBatch.isPending}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export function BatchRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
      <div className="bg-muted h-2 w-2 shrink-0 animate-pulse rounded-full" />
      <div className="flex-1 space-y-1.5">
        <div className="bg-muted h-3 w-64 animate-pulse rounded" />
        <div className="bg-muted h-3.5 w-48 animate-pulse rounded" />
      </div>
      <div className="flex gap-2">
        <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
        <div className="bg-muted hidden h-3.5 w-20 animate-pulse rounded sm:block" />
      </div>
    </div>
  );
}
