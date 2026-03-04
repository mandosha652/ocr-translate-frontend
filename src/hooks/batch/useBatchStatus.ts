'use client';

import { useQuery } from '@tanstack/react-query';

import { translateApi } from '@/lib/api';
import { BATCH_STATUS_POLL_INTERVAL } from '@/lib/constants';
import type { BatchStatus } from '@/types';

export const TERMINAL_STATUSES: BatchStatus[] = [
  'completed',
  'partially_completed',
  'failed',
  'cancelled',
];

export function useBatchStatus(
  batchId: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['batch', batchId],
    queryFn: () => {
      if (!batchId) throw new Error('Batch ID required');
      return translateApi.getBatchStatus(batchId);
    },
    enabled: !!batchId && (options?.enabled ?? true),
    refetchInterval: query => {
      const status = query.state.data?.status;
      if (status === 'pending' || status === 'processing') {
        return BATCH_STATUS_POLL_INTERVAL;
      }
      return false;
    },
  });
}
