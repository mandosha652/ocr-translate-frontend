'use client';

import { ChevronDown, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useCopyToClipboard } from '@/hooks/shared/useCopyToClipboard';
import { cn } from '@/lib/utils';
import type { TranslateResponse } from '@/types';

import { RegionCard } from './RegionCard';

interface TextRegionsPanelProps {
  regions: TranslateResponse['regions'];
  lowConfidenceRegions: TranslateResponse['regions'];
}

export function TextRegionsPanel({
  regions,
  lowConfidenceRegions,
}: TextRegionsPanelProps) {
  const [showRegions, setShowRegions] = useState(false);
  const { copied, copy } = useCopyToClipboard();
  const [copiedRegion, setCopiedRegion] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) setCopiedRegion(null);
  }, [copied]);

  const copyRegionText = async (text: string, key: string) => {
    try {
      await copy(text);
      setCopiedRegion(key);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (regions.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={() => setShowRegions(v => !v)}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex cursor-pointer items-center gap-1.5 rounded text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            showRegions && 'rotate-180'
          )}
        />
        {showRegions ? 'Hide' : 'Show'} text regions ({regions.length})
      </button>
      {showRegions && (
        <>
          <div className="max-h-52 space-y-2 overflow-y-auto rounded-lg border p-3">
            {regions.map(region => (
              <RegionCard
                key={region.id}
                region={region}
                onCopyRegion={copyRegionText}
                copiedRegion={copiedRegion}
              />
            ))}
          </div>
          {lowConfidenceRegions.length > 0 && (
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <Info className="h-3 w-3 text-amber-500" />
              Regions below 70% confidence may have OCR errors — verify manually
              if accuracy is critical
            </p>
          )}
        </>
      )}
    </div>
  );
}
