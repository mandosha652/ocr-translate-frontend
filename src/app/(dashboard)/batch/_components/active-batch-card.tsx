'use client';

import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { BatchProgress } from '@/components/features/batch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBatchStream } from '@/hooks';
import { TERMINAL_STATUSES } from '@/hooks/batch/useBatchStatus';
import { useNotificationStore } from '@/store/notificationStore';
import type { BatchStatusResponse } from '@/types';

interface ActiveBatchCardProps {
  batch: BatchStatusResponse;
  onCancel: () => void;
  isCancelling: boolean;
  onDone: () => void;
}

export function ActiveBatchCard({
  batch,
  onCancel,
  isCancelling,
  onDone,
}: ActiveBatchCardProps) {
  const isActive = batch.status === 'pending' || batch.status === 'processing';
  const { progress } = useBatchStream(batch.batch_id, isActive);
  const onDoneRef = useRef(onDone);
  const notifiedRef = useRef<string | null>(null);
  const pushNotification = useNotificationStore(s => s.push);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (progress?.done) {
      onDoneRef.current();
    }
  }, [progress?.done]);

  const merged: BatchStatusResponse = progress
    ? {
        ...batch,
        status: progress.status as BatchStatusResponse['status'],
        completed_count: progress.completed_count,
        failed_count: progress.failed_count,
      }
    : batch;

  useEffect(() => {
    const { status, batch_id, total_images, completed_count, failed_count } =
      merged;
    if (!TERMINAL_STATUSES.includes(status)) return;
    if (notifiedRef.current === batch_id) return;
    notifiedRef.current = batch_id;

    const href = '/history';

    if (status === 'completed') {
      const msg = `Batch complete — ${completed_count}/${total_images} image${total_images !== 1 ? 's' : ''} translated`;
      toast.success(msg);
      pushNotification({
        message: msg,
        href,
        type: 'success',
        timestamp: new Date().toISOString(),
      });
    } else if (status === 'partially_completed') {
      const msg = `Batch partially complete — ${completed_count} done, ${failed_count} failed`;
      toast.warning(msg);
      pushNotification({
        message: msg,
        href,
        type: 'warning',
        timestamp: new Date().toISOString(),
      });
    } else if (status === 'failed') {
      const msg = `Batch failed — ${failed_count}/${total_images} image${total_images !== 1 ? 's' : ''} could not be processed`;
      toast.error(msg);
      pushNotification({
        message: msg,
        href,
        type: 'error',
        timestamp: new Date().toISOString(),
      });
    } else if (status === 'cancelled') {
      toast.info('Batch cancelled');
      pushNotification({
        message: 'Batch was cancelled',
        href,
        type: 'info',
        timestamp: new Date().toISOString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merged.status, merged.batch_id, pushNotification]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="relative flex h-2 w-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
            </span>
            Running
          </CardTitle>
          <p className="text-muted-foreground text-xs">
            {format(new Date(batch.created_at), 'HH:mm')}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <BatchProgress
          batchStatus={merged}
          onCancel={onCancel}
          isCancelling={isCancelling}
        />
      </CardContent>
    </Card>
  );
}
