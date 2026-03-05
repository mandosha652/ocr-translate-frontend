'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { teamApi, teamTokenStorage } from '@/lib/api/team';
import {
  BATCH_LIST_POLL_INTERVAL,
  BATCH_STATUS_POLL_INTERVAL,
  TEAM_SLUG,
} from '@/lib/constants';
import type { TeamBatchStatus } from '@/types';

/** Returns true only after hydration, avoiding server/client mismatch for localStorage checks. */
function useHasTeamToken() {
  const [has] = useState(() => {
    if (typeof window === 'undefined') return false;
    return teamTokenStorage.has();
  });
  return has;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export function useTeamLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      teamApi.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-batches'] });
    },
  });
}

export function useTeamLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => teamApi.logout(),
    onSettled: () => {
      queryClient.clear();
      router.push(`/ops/${TEAM_SLUG}/login`);
    },
  });
}

// ---------------------------------------------------------------------------
// CSV upload
// ---------------------------------------------------------------------------

export function useTeamUploadCsv() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => teamApi.uploadCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-batches'] });
    },
  });
}

// ---------------------------------------------------------------------------
// Batch list
// ---------------------------------------------------------------------------

export function useTeamBatches() {
  const hasToken = useHasTeamToken();
  return useQuery({
    queryKey: ['team-batches'],
    queryFn: () => teamApi.listBatches(),
    enabled: hasToken,
    staleTime: 10_000,
    refetchInterval: query => {
      const batches = query.state.data?.batches;
      if (!batches) return false;
      const hasActive = batches.some(b =>
        ['pending', 'processing'].includes(b.status)
      );
      return hasActive ? BATCH_LIST_POLL_INTERVAL : false;
    },
  });
}

// ---------------------------------------------------------------------------
// Batch status (with polling)
// ---------------------------------------------------------------------------

function _isDone(batch: TeamBatchStatus): boolean {
  const imageDone = !['pending', 'processing'].includes(batch.status);
  const captionsDone = batch.captions_status === 'completed';
  return imageDone && captionsDone;
}

export function useTeamBatchStatus(id: string | null) {
  const hasToken = useHasTeamToken();
  return useQuery({
    queryKey: ['team-batch', id],
    queryFn: () => teamApi.getBatchStatus(id!),
    enabled: !!id && hasToken,
    refetchInterval: query => {
      const data = query.state.data;
      return !data || _isDone(data) ? false : BATCH_STATUS_POLL_INTERVAL;
    },
  });
}

// ---------------------------------------------------------------------------
// CSV export — triggers browser download automatically on success
// ---------------------------------------------------------------------------

export function useTeamExportCsv(id: string | null) {
  return useMutation({
    mutationFn: () => {
      if (!id) throw new Error('Batch ID required');
      return teamApi.exportCsv(id);
    },
    onSuccess: (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `batch_${id ?? 'export'}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}

// ---------------------------------------------------------------------------
// Cancel batch
// ---------------------------------------------------------------------------

export function useTeamCancelBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId: string) => teamApi.cancelBatch(batchId),
    onSuccess: (_data, batchId) => {
      queryClient.invalidateQueries({ queryKey: ['team-batches'] });
      queryClient.invalidateQueries({ queryKey: ['team-batch', batchId] });
    },
  });
}
