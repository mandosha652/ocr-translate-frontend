'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { teamApi, teamTokenStorage } from '@/lib/api/team';
import { BATCH_LIST_POLL_INTERVAL, TEAM_SLUG } from '@/lib/constants';
import type { TeamBatchStatus } from '@/types';
import type { BatchStatus } from '@/types/batch';

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
// Quick translate (single image)
// ---------------------------------------------------------------------------

export function useTeamQuickTranslate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      file?: File;
      imageUrl?: string;
      caption?: string;
      sourceLang: string;
      targetLangs: string[];
      excludeText?: string;
      removeLogo?: boolean;
    }) => teamApi.quickTranslate(params),
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
    mutationFn: (params: {
      file: File;
      excludeText?: string;
      removeLogo?: boolean;
    }) =>
      teamApi.uploadCsv(params.file, {
        excludeText: params.excludeText,
        removeLogo: params.removeLogo,
      }),
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
// Batch status (SSE-driven, falls back to single fetch when done)
// ---------------------------------------------------------------------------

const TERMINAL_STATUSES = new Set([
  'completed',
  'partially_completed',
  'failed',
  'cancelled',
]);

export function useTeamBatchStatus(id: string | null) {
  const hasToken = useHasTeamToken();
  const queryClient = useQueryClient();
  const cleanupRef = useRef<(() => void) | null>(null);

  const query = useQuery({
    queryKey: ['team-batch', id],
    queryFn: () => teamApi.getBatchStatus(id!),
    enabled: !!id && hasToken,
    staleTime: Infinity,
    // Poll for captions_status after images are done (SSE doesn't cover captions)
    refetchInterval: query => {
      const data = query.state.data;
      if (!data) return false;
      const imagesDone = TERMINAL_STATUSES.has(data.status);
      const captionsDone = data.captions_status === 'completed';
      if (!imagesDone) return false; // SSE handles this phase
      return captionsDone ? false : 2000;
    },
  });

  useEffect(() => {
    if (!id || !hasToken) return;
    // Don't open a stream if images are already in a terminal state
    if (query.data && TERMINAL_STATUSES.has(query.data.status)) return;

    cleanupRef.current?.();

    const cleanup = teamApi.streamBatchProgress(
      id,
      event => {
        queryClient.setQueryData<TeamBatchStatus>(['team-batch', id], prev =>
          prev
            ? {
                ...prev,
                status: event.status as BatchStatus,
                total_images: event.total_images,
                completed_count: event.completed_count,
                failed_count: event.failed_count,
                total_translations: event.total_translations,
                completed_translations: event.completed_translations,
              }
            : prev
        );
      },
      () => {
        // Images done — full refetch to get final data + captions_status
        void queryClient.invalidateQueries({ queryKey: ['team-batch', id] });
        void queryClient.invalidateQueries({ queryKey: ['team-batches'] });
      }
    );

    cleanupRef.current = cleanup;
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, hasToken]);

  return query;
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

// ---------------------------------------------------------------------------
// Retry single image
// ---------------------------------------------------------------------------

export function useTeamRetryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, imageId }: { batchId: string; imageId: string }) =>
      teamApi.retryImage(batchId, imageId),
    onSuccess: (_data, { batchId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-batches'] });
      queryClient.invalidateQueries({ queryKey: ['team-batch', batchId] });
    },
  });
}

// ---------------------------------------------------------------------------
// Retry all failed images
// ---------------------------------------------------------------------------

export function useTeamRetryAllFailed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId: string) => teamApi.retryAllFailed(batchId),
    onSuccess: (_data, batchId) => {
      queryClient.invalidateQueries({ queryKey: ['team-batches'] });
      queryClient.invalidateQueries({ queryKey: ['team-batch', batchId] });
    },
  });
}

// ---------------------------------------------------------------------------
// Update translated caption
// ---------------------------------------------------------------------------

export function useTeamUpdateCaption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batchId,
      imageId,
      lang,
      caption,
    }: {
      batchId: string;
      imageId: string;
      lang: string;
      caption: string;
    }) => teamApi.updateCaption(batchId, imageId, lang, caption),
    onSuccess: (_data, { batchId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-batch', batchId] });
    },
  });
}

// ---------------------------------------------------------------------------
// Resize translations to 1080×1350
// ---------------------------------------------------------------------------

export function useTeamResizeTranslations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batchId,
      translationIds,
    }: {
      batchId: string;
      translationIds: string[] | null;
    }) => teamApi.resizeTranslations(batchId, translationIds),
    onSuccess: (_data, { batchId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-batch', batchId] });
    },
  });
}
