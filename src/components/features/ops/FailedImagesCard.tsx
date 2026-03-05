'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ImageResult } from '@/types/batch';

interface FailedImagesCardProps {
  images: ImageResult[];
}

export function FailedImagesCard({ images }: FailedImagesCardProps) {
  const failed = images.filter(img => img.status === 'failed');

  if (failed.length === 0) return null;

  return (
    <Card className="border-destructive/20 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-destructive flex items-center gap-2 text-sm font-semibold">
          <AlertTriangle className="h-4 w-4" />
          {failed.length} Failed Image{failed.length !== 1 ? 's' : ''}
        </CardTitle>
        <CardDescription className="text-xs">
          These images could not be processed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {failed.map(img => (
            <div
              key={img.image_id}
              className="bg-muted/20 rounded-xl border px-3.5 py-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-xs font-medium"
                    title={img.original_filename}
                  >
                    {img.original_filename}
                  </p>
                  {img.error ? (
                    <p className="text-destructive/80 mt-1 text-xs">
                      {img.error}
                    </p>
                  ) : null}
                </div>
                {img.original_image_url ? (
                  <a
                    href={img.original_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                    title="View original"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
