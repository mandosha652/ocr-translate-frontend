'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { BatchImageList } from './BatchImageList';

interface Image {
  id: string;
  original_filename: string;
  status: string;
  error?: string | null;
}

interface BatchDetailImagesProps {
  images: Image[];
  onRetryImage: (imageId: string) => void;
  isRetrying: boolean;
}

export function BatchDetailImages({
  images,
  onRetryImage,
  isRetrying,
}: BatchDetailImagesProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Images{' '}
          <span className="text-muted-foreground font-normal">
            ({images.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <BatchImageList
          images={images}
          onRetryImage={onRetryImage}
          isRetrying={isRetrying}
        />
      </CardContent>
    </Card>
  );
}
