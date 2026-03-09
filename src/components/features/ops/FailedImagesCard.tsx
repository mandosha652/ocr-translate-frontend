'use client';

import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import type { ImageResult } from '@/types/batch';

interface FailedImagesCardProps {
  images: ImageResult[];
  batchId?: string;
  onRetryImage?: (batchId: string, imageId: string) => void;
  onRetryAll?: (batchId: string) => void;
  retrying?: boolean;
}

export function FailedImagesCard({
  images,
  batchId,
  onRetryImage,
  onRetryAll,
  retrying,
}: FailedImagesCardProps) {
  const failed = images.filter(img => img.status === 'failed');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Keep card visible while retry is in-flight even if failed list is momentarily empty
  if (failed.length === 0 && !retrying) return null;

  const canRetry = !!(batchId && onRetryImage);
  const isRetryingAll = retrying && !retryingId;

  function handleRetryOne(imageId: string) {
    if (!batchId || !onRetryImage) return;
    setRetryingId(imageId);
    onRetryImage(batchId, imageId);
    setTimeout(() => setRetryingId(null), 2000);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#FF453A]/20 bg-white shadow-sm dark:border-[#FF453A]/25 dark:bg-[#1C1C1E]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF453A]/10">
            <AlertTriangle className="h-3.5 w-3.5 text-[#FF453A]" />
          </div>
          <div>
            <p className="text-sm leading-none font-semibold">
              {retrying && failed.length === 0
                ? 'Retrying…'
                : `${failed.length} image${failed.length !== 1 ? 's' : ''} failed`}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
              {retrying && failed.length === 0
                ? 'Processing in background'
                : 'Could not be processed'}
            </p>
          </div>
        </div>
        {batchId && onRetryAll && failed.length > 1 ? (
          <button
            onClick={() => onRetryAll(batchId)}
            disabled={isRetryingAll || !!retryingId}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#FF453A] px-3 text-[11px] font-semibold text-white transition-all hover:bg-[#e03530] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3 w-3 ${isRetryingAll ? 'animate-spin' : ''}`}
            />
            {isRetryingAll ? 'Retrying…' : `Retry all ${failed.length}`}
          </button>
        ) : null}
      </div>

      {/* Image rows */}
      <div className="border-t border-black/6 dark:border-white/8">
        {failed.map((img, idx) => {
          const isThis = retryingId === img.image_id;
          return (
            <div
              key={img.image_id}
              className={`flex items-center gap-3 px-4 py-3 ${idx !== failed.length - 1 ? 'border-b border-black/5 dark:border-white/6' : ''}`}
            >
              {/* Red dot */}
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF453A]" />

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-xs font-medium"
                  title={img.original_filename ?? undefined}
                >
                  {img.original_filename || 'Image'}
                </p>
                {img.error ? (
                  <p className="truncate text-[10px] text-gray-400 dark:text-gray-500">
                    {img.error}
                  </p>
                ) : null}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1.5">
                {img.original_image_url ? (
                  <a
                    href={img.original_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View original"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-600 dark:hover:bg-white/8 dark:hover:text-gray-300"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
                {canRetry ? (
                  <button
                    onClick={() => handleRetryOne(img.image_id)}
                    disabled={isThis || !!retrying}
                    className="flex h-7 items-center gap-1 rounded-lg border border-[#FF453A]/25 px-2.5 text-[10px] font-semibold text-[#FF453A] transition-all hover:bg-[#FF453A]/8 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#FF453A]/30 dark:hover:bg-[#FF453A]/12"
                  >
                    <RefreshCw
                      className={`h-3 w-3 ${isThis ? 'animate-spin' : ''}`}
                    />
                    {isThis ? 'Retrying' : 'Retry'}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
