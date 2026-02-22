import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import type { UsageStatsResponse } from '@/types';

export function useUsageStats() {
  return useQuery<UsageStatsResponse>({
    queryKey: ['usageStats'],
    queryFn: () => authApi.getUsageStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes — stats don't need to be real-time
  });
}
