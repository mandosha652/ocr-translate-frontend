'use client';

import { useQuery } from '@tanstack/react-query';

import { translateApi } from '@/lib/api';
import { TRANSLATION_JOB_POLL_INTERVAL } from '@/lib/constants';
import type { TranslationJobStatus } from '@/types';

const TERMINAL_JOB_STATUSES: TranslationJobStatus[] = ['completed', 'failed'];

export function useTranslationJob(jobId: string | null) {
  return useQuery({
    queryKey: ['translationJob', jobId],
    queryFn: () => {
      if (!jobId) throw new Error('Job ID required');
      return translateApi.getTranslationJob(jobId);
    },
    enabled: !!jobId,
    refetchInterval: query => {
      const status = query.state.data?.status;
      if (status && TERMINAL_JOB_STATUSES.includes(status)) return false;
      return TRANSLATION_JOB_POLL_INTERVAL;
    },
  });
}
