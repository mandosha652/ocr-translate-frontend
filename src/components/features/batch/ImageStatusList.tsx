'use client';

import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { ImageResult, ImageStatus } from '@/types';

const imageStatusConfig: Record<
  ImageStatus,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  pending: { icon: Clock, color: 'text-muted-foreground' },
  processing: { icon: Loader2, color: 'text-primary' },
  completed: { icon: CheckCircle2, color: 'text-green-500' },
  failed: { icon: XCircle, color: 'text-destructive' },
};

interface ImageStatusListProps {
  images: ImageResult[];
}

export function ImageStatusList({ images }: ImageStatusListProps) {
  return (
    <TooltipProvider>
      <div className="max-h-48 space-y-2 overflow-y-auto">
        {images.map(image => {
          const imgConfig = imageStatusConfig[image.status];
          const ImgIcon = imgConfig.icon;
          const isLong = image.original_filename.length > 30;

          return (
            <div
              key={image.image_id}
              className="bg-muted/50 flex items-center justify-between rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <ImgIcon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    imgConfig.color,
                    image.status === 'processing' && 'animate-spin'
                  )}
                />
                {isLong ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-default truncate text-sm">
                        {image.original_filename}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{image.original_filename}</TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="truncate text-sm">
                    {image.original_filename}
                  </span>
                )}
              </div>
              {image.error ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-destructive ml-2 cursor-default truncate text-xs">
                      {image.error}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{image.error}</TooltipContent>
                </Tooltip>
              ) : null}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
