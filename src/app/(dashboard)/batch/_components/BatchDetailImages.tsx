'use client';

import { AlertCircle, ImageIcon, Loader2 } from 'lucide-react';

import type { BatchStatusResponse } from '@/types';

interface BatchDetailImagesProps {
  batch: BatchStatusResponse;
  isProcessing: boolean;
  isExpired: boolean;
}

export function BatchDetailImages({
  batch,
  isProcessing,
  isExpired,
}: BatchDetailImagesProps) {
  const pendingImages = batch.images.filter(
    i => i.status === 'pending' || i.status === 'processing'
  );

  return (
    <>
      {/* Expired notice */}
      {isExpired ? (
        <div className="text-muted-foreground flex items-center gap-2 rounded-lg border px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Image results have expired and are no longer available for download.
        </div>
      ) : null}

      {/* In-progress images */}
      {isProcessing && pendingImages.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            In Progress ({pendingImages.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {pendingImages.map(img => (
              <div
                key={img.image_id}
                className="bg-card flex flex-col items-center justify-center gap-2 rounded-xl border p-4"
              >
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                  <ImageIcon className="text-muted-foreground h-5 w-5" />
                </div>
                <p
                  className="text-muted-foreground max-w-full truncate text-xs"
                  title={img.original_filename}
                >
                  {img.original_filename}
                </p>
                <Loader2 className="text-primary h-4 w-4 animate-spin" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Expired placeholder grid */}
      {isExpired && batch.images.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Images ({batch.images.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {batch.images.map(img => (
              <div
                key={img.image_id}
                className="bg-card overflow-hidden rounded-xl border"
              >
                <div className="bg-muted flex aspect-square items-center justify-center">
                  <ImageIcon className="text-muted-foreground/40 h-8 w-8" />
                </div>
                <div className="p-2.5">
                  <p
                    className="truncate text-xs font-medium"
                    title={img.original_filename}
                  >
                    {img.original_filename}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">Expired</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
