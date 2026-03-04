'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ImagePreviewGridProps {
  files: File[];
  previews: Map<string, string>;
  disabled?: boolean;
  onRemove: (index: number) => void;
  onPreview: (file: File, preview: string) => void;
  getFileKey: (file: File) => string;
}

export function ImagePreviewGrid({
  files,
  previews,
  disabled,
  onRemove,
  onPreview,
  getFileKey,
}: ImagePreviewGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {files.map((file, index) => {
        const key = getFileKey(file);
        const preview = previews.get(key);

        return (
          <div
            key={key}
            className="group bg-muted/50 relative overflow-hidden rounded-lg border"
          >
            <div
              className="relative aspect-square cursor-pointer"
              onClick={() => preview && onPreview(file, preview)}
            >
              {preview ? (
                <Image
                  src={preview}
                  alt={file.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <Skeleton className="absolute inset-0 rounded-none" />
              )}
            </div>
            <Button
              variant="destructive"
              size="icon"
              aria-label={`Remove ${file.name}`}
              title={`Remove ${file.name}`}
              className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              onClick={() => onRemove(index)}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="absolute right-0 bottom-0 left-0 bg-black/60 px-2 py-1">
              <p className="truncate text-xs text-white">{file.name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
