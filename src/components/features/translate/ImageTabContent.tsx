'use client';

import { getImageUrl } from '@/lib/utils';

import { ImageControls } from './ImageControls';
import { ZoomableImage } from './ZoomableImage';

interface ImageTabContentProps {
  imageUrl: string;
  alt: string;
  filename: string;
  description?: string;
  showCopyButton?: boolean;
  showExternalLink?: boolean;
  priority?: boolean;
}

export function ImageTabContent({
  imageUrl,
  alt,
  filename,
  description,
  showCopyButton,
  showExternalLink,
  priority,
}: ImageTabContentProps) {
  const resolvedUrl = getImageUrl(imageUrl);

  return (
    <div className="space-y-4">
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      <ZoomableImage src={resolvedUrl} alt={alt} priority={priority} />
      <ImageControls
        imageUrl={resolvedUrl}
        filename={filename}
        showCopyButton={showCopyButton}
        showExternalLink={showExternalLink}
      />
    </div>
  );
}
