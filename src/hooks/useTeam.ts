'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { teamApi, teamTokenStorage } from '@/lib/api/team';
import { BATCH_STATUS_POLL_INTERVAL } from '@/lib/constants';
import type { TeamBatchStatus } from '@/types';

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
  return useQuery({
    queryKey: ['team-batches'],
    queryFn: () => teamApi.listBatches(),
    enabled: teamTokenStorage.has(),
    staleTime: 10_000,
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
  return useQuery({
    queryKey: ['team-batch', id],
    queryFn: () => teamApi.getBatchStatus(id!),
    enabled: !!id && teamTokenStorage.has(),
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
