'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import type { BatchStatusResponse } from '@/types';

export function useBatchCompletionNotifier(
  batches: BatchStatusResponse[] | undefined
) {
  const prevStatusesRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!batches) return;
    const prev = prevStatusesRef.current;

    batches.forEach(batch => {
      const prevStatus = prev.get(batch.batch_id);
      const isNowFinished =
        batch.status === 'completed' ||
        batch.status === 'partially_completed' ||
        batch.status === 'failed' ||
        batch.status === 'cancelled';
      const wasActive = prevStatus === 'pending' || prevStatus === 'processing';

      if (wasActive && isNowFinished) {
        const label =
          batch.status === 'completed'
            ? 'Batch completed'
            : batch.status === 'partially_completed'
              ? 'Batch partially completed'
              : batch.status === 'failed'
                ? 'Batch failed'
                : 'Batch cancelled';
        const detail = `${batch.completed_count} of ${batch.total_images} images processed`;

        if (
          typeof window !== 'undefined' &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          new Notification(label, { body: detail, icon: '/favicon.ico' });
        } else {
          toast.info(`${label} — ${detail}`);
        }
      }

      prev.set(batch.batch_id, batch.status);
    });
  }, [batches]);
}
