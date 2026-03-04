'use client';

import { Check, Copy, Download, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/shared/useCopyToClipboard';
import { useImageDownload } from '@/hooks/shared/useImageDownload';

interface ImageControlsProps {
  imageUrl: string;
  filename: string;
  showCopyButton?: boolean;
  showExternalLink?: boolean;
}

export function ImageControls({
  imageUrl,
  filename,
  showCopyButton,
  showExternalLink,
}: ImageControlsProps) {
  const { copied, copy } = useCopyToClipboard();
  const { downloadImage } = useImageDownload();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) setCopiedUrl(null);
  }, [copied]);

  const handleCopyUrl = async () => {
    try {
      await copy(imageUrl);
      setCopiedUrl(imageUrl);
    } catch {
      // Error already shown by useCopyToClipboard
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={showCopyButton ? 'default' : 'outline'}
        size="sm"
        className={showCopyButton ? 'flex-1' : undefined}
        onClick={() => downloadImage(imageUrl, filename)}
      >
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      {showCopyButton && (
        <Button
          variant="outline"
          size="sm"
          aria-label={copiedUrl === imageUrl ? 'Copied' : 'Copy URL'}
          onClick={handleCopyUrl}
        >
          {copiedUrl === imageUrl ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}
      {showExternalLink && (
        <Button variant="outline" size="sm" asChild>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
