'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Languages,
  Loader2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type { TeamBatchStatus } from '@/types';
import { langName } from '@/types/language';

interface BatchStatusCardProps {
  batch: TeamBatchStatus;
}

function StatusIcon({
  isProcessing,
  isCompleted,
  isFailed,
}: {
  isProcessing: boolean;
  isCompleted: boolean;
  isFailed: boolean;
}) {
  if (isProcessing) {
    return <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0A84FF]" />;
  }
  if (isCompleted) {
    return <CheckCircle2 className="h-3.5 w-3.5 text-[#30D158]" />;
  }
  if (isFailed) {
    return <AlertTriangle className="h-3.5 w-3.5 text-[#FF453A]" />;
  }
  return null;
}

function countCaptions(batch: TeamBatchStatus): {
  done: number;
  total: number;
} {
  let done = 0;
  let total = 0;
  for (const img of batch.images ?? []) {
    if (!img.caption) continue;
    for (const t of img.translations) {
      total++;
      if (t.translated_caption) done++;
    }
  }
  return { done, total };
}

export function BatchStatusCard({ batch }: BatchStatusCardProps) {
  // Use translation-level counts when available (1 img × 5 langs = 5 translations)
  const totalProgress = batch.total_translations ?? batch.total_images;
  const completedProgress =
    batch.completed_translations ?? batch.completed_count;

  const imagesPct =
    totalProgress > 0
      ? Math.round((completedProgress / totalProgress) * 100)
      : 0;

  const { done: captionsDone, total: captionsTotal } = countCaptions(batch);
  const captionsPct =
    captionsTotal > 0
      ? Math.round((captionsDone / captionsTotal) * 100)
      : batch.captions_status === 'completed'
        ? 100
        : 0;

  const isProcessing = ['pending', 'processing'].includes(batch.status);
  const isCompleted = ['completed', 'partially_completed'].includes(
    batch.status
  );
  const isFailed = batch.status === 'failed';

  return (
    <div className="overflow-hidden rounded-2xl border border-black/6 bg-white shadow-sm dark:border-white/8 dark:bg-[#1C1C1E]">
      {/* Header stripe */}
      <div className="border-b border-black/6 bg-black/2 px-5 py-3.5 dark:border-white/8 dark:bg-white/3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <StatusIcon
              isProcessing={isProcessing}
              isCompleted={isCompleted}
              isFailed={isFailed}
            />
            <p className="text-sm font-semibold">
              {batch.total_images === 1 ? 'Translation Status' : 'Batch Status'}
            </p>
          </div>
          <code className="rounded-lg bg-black/5 px-2 py-0.5 font-mono text-[11px] text-gray-500 dark:bg-white/12 dark:text-gray-300">
            {batch.batch_id.slice(0, 8)}
          </code>
        </div>
      </div>

      {/* Progress section */}
      <div className="space-y-5 p-5">
        {/* Images progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              {totalProgress === 1 ? 'Translating' : 'Translations'}
            </span>
            {totalProgress > 1 ? (
              <span className="font-semibold tabular-nums">
                {completedProgress}
                <span className="text-muted-foreground font-normal">
                  {' '}
                  / {totalProgress}
                </span>
              </span>
            ) : null}
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-black/6 dark:bg-white/8">
            {isProcessing && imagesPct === 0 ? (
              <div className="absolute inset-0 animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full bg-linear-to-r from-transparent via-[#0A84FF] to-transparent" />
            ) : (
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  isProcessing
                    ? 'bg-[#0A84FF]'
                    : isCompleted
                      ? 'bg-[#30D158]'
                      : 'bg-[#FF453A]'
                )}
                style={{ width: `${imagesPct}%` }}
              />
            )}
          </div>
          <p className="text-right text-[10px] font-medium text-gray-400 tabular-nums">
            {isProcessing && imagesPct === 0 ? '…' : `${imagesPct}%`}
          </p>
        </div>

        {/* Captions progress */}
        {captionsTotal > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Captions
              </span>
              <span className="font-semibold tabular-nums">
                {captionsTotal > 0 ? (
                  <>
                    {captionsDone}
                    <span className="text-muted-foreground font-normal">
                      {' '}
                      / {captionsTotal}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400 capitalize">
                    {batch.captions_status}
                  </span>
                )}
              </span>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-black/6 dark:bg-white/8">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  captionsPct === 100 ? 'bg-[#30D158]' : 'bg-[#0A84FF]'
                )}
                style={{ width: `${captionsPct}%` }}
              />
            </div>
          </div>
        ) : null}

        {/* Footer info */}
        <div className="flex flex-wrap items-center gap-3 border-t border-black/6 pt-4 dark:border-white/8">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <Languages className="h-3.5 w-3.5" />
            <span>{batch.target_languages.map(langName).join(' · ')}</span>
          </div>
          {batch.failed_count > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#FF453A]">
              <AlertTriangle className="h-3.5 w-3.5" />
              {batch.failed_count} failed
            </div>
          )}
          {isProcessing ? (
            <div className="flex items-center gap-1.5 text-[11px] text-[#0A84FF]">
              <Clock className="h-3.5 w-3.5" />
              In progress
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
