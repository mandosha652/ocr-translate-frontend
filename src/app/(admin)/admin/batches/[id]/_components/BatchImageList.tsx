'use client';

import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ADMIN_IMAGE_STATUS_CONFIG } from '@/lib/constants/admin';

interface Image {
  id: string;
  original_filename: string;
  status: string;
  error?: string | null;
}

interface BatchImageListProps {
  images: Image[];
  onRetryImage: (imageId: string) => void;
  isRetrying: boolean;
}

export function BatchImageList({
  images,
  onRetryImage,
  isRetrying,
}: BatchImageListProps) {
  if (images.length === 0) {
    return (
      <div className="text-muted-foreground flex h-32 items-center justify-center rounded-lg border border-dashed">
        No images
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {images.map(image => {
        const config = ADMIN_IMAGE_STATUS_CONFIG[image.status] || {
          className: 'border-border text-muted-foreground',
          dot: 'bg-muted-foreground/30',
        };

        return (
          <div
            key={image.id}
            className="flex items-center gap-3 rounded-lg border px-3 py-2"
          >
            <div className={`h-2 w-2 shrink-0 rounded-full ${config.dot}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{image.original_filename}</p>
              {image.error ? (
                <p className="text-destructive text-xs">{image.error}</p>
              ) : null}
            </div>
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${config.className}`}
            >
              {image.status}
            </span>
            {image.status === 'failed' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onRetryImage(image.id)}
                disabled={isRetrying}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
