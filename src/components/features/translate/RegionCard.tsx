'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CONFIDENCE_THRESHOLD } from '@/lib/constants';
import type { TranslateResponse } from '@/types';

interface RegionCardProps {
  region: TranslateResponse['regions'][0];
  onCopyRegion: (text: string, key: string) => Promise<void>;
  copiedRegion: string | null;
}

export function RegionCard({
  region,
  onCopyRegion,
  copiedRegion,
}: RegionCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async (text: string, key: string) => {
    setIsLoading(true);
    try {
      await onCopyRegion(text, key);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-muted rounded p-2 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center gap-1">
            <p className="font-medium">{region.original_text}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    handleCopy(region.original_text, `orig-${region.id}`)
                  }
                  disabled={isLoading}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 cursor-pointer rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {copiedRegion === `orig-${region.id}` ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>Copy original</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-muted-foreground">→ {region.translated_text}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    handleCopy(region.translated_text, `trans-${region.id}`)
                  }
                  disabled={isLoading}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 cursor-pointer rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {copiedRegion === `trans-${region.id}` ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>Copy translation</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant={
                region.confidence >= CONFIDENCE_THRESHOLD
                  ? 'outline'
                  : 'secondary'
              }
              className={`shrink-0 cursor-default text-xs ${region.confidence < CONFIDENCE_THRESHOLD ? 'text-amber-600' : ''}`}
            >
              {Math.round(region.confidence * 100)}%
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            OCR confidence score — higher means the text was recognised more
            reliably
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
