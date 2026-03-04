'use client';

import { useMutation } from '@tanstack/react-query';

import { translateApi } from '@/lib/api';

export function useCancelBatch() {
  return useMutation({
    mutationFn: (batchId: string) => translateApi.cancelBatch(batchId),
  });
}
