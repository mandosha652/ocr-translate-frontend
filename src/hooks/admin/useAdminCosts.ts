'use client';

import { useQuery } from '@tanstack/react-query';

import { adminApi } from '@/lib/api/admin';

import { adminEnabled } from './adminEnabled';

export function useAdminCostSummary(
  period: 'today' | 'week' | 'month' | 'alltime' = 'month'
) {
  return useQuery({
    queryKey: ['admin', 'costs', 'summary', period],
    queryFn: () => adminApi.getCostSummary(period),
    enabled: adminEnabled(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminCostDaily(days: number = 30) {
  return useQuery({
    queryKey: ['admin', 'costs', 'daily', days],
    queryFn: () => adminApi.getCostDaily(days),
    enabled: adminEnabled(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminCostByUser(
  period: 'today' | 'week' | 'month' | 'alltime' = 'month'
) {
  return useQuery({
    queryKey: ['admin', 'costs', 'by-user', period],
    queryFn: () => adminApi.getCostByUser(period),
    enabled: adminEnabled(),
    staleTime: 5 * 60 * 1000,
  });
}
