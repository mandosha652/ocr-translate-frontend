'use client';

import { Check, Copy, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCopyToClipboard } from '@/hooks/shared/useCopyToClipboard';
import { getImageUrl } from '@/lib/utils';

import { ZoomableImage } from './ZoomableImage';

interface TranslationJobResultProps {
  outputUrl: string;
  targetLang: string;
}

export function TranslationJobResult({
  outputUrl,
  targetLang,
}: TranslationJobResultProps) {
  const { copied, copy } = useCopyToClipboard();

  const fullUrl = getImageUrl(outputUrl);

  const copyUrl = async () => {
    try {
      await copy(fullUrl);
      toast.success('URL copied to clipboard');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `translated-${targetLang}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Image downloaded');
    } catch {
      toast.error('Failed to download image');
    }
  };

  return (
    <Card className="animate-in fade-in-0 duration-300">
      <CardHeader>
        <CardTitle>Translation Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ZoomableImage src={fullUrl} alt="Translated image" priority />
        <div className="flex gap-2">
          <Button className="flex-1" onClick={downloadImage}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            aria-label={copied ? 'Copied' : 'Copy URL'}
            onClick={copyUrl}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" asChild>
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
