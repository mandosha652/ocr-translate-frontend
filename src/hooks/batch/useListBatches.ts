'use client';

import { useQuery } from '@tanstack/react-query';

import { translateApi } from '@/lib/api';
import { BATCH_LIST_POLL_INTERVAL } from '@/lib/constants';

export function useListBatches(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['batches'],
    queryFn: () => translateApi.listBatches(),
    enabled: options?.enabled ?? false,
    refetchInterval: BATCH_LIST_POLL_INTERVAL,
    refetchIntervalInBackground: false,
  });
}
