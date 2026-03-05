'use client';

import {
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  ImageIcon,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { BATCH_STATUS_CONFIG } from '@/lib/constants/ui';
import { cn, getImageUrl } from '@/lib/utils';
import type { BatchStatusResponse } from '@/types';

import { formatDate, getLangName } from './utils';

interface BatchCardHeaderProps {
  batch: BatchStatusResponse;
  expanded: boolean;
  panelId: string;
  onToggle: () => void;
  onDownloadAll: () => void;
  isZipping: boolean;
}

export function BatchCardHeader({
  batch,
  expanded,
  panelId,
  onToggle,
  onDownloadAll,
  isZipping,
}: BatchCardHeaderProps) {
  const cfg = BATCH_STATUS_CONFIG[batch.status];
  const langList = batch.target_languages.map(getLangName).join(', ');
  const completedImages = batch.images.filter(i => i.status === 'completed');
  const isExpired = batch.is_expired;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-controls={panelId}
      className="focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-4 p-4 text-left focus-visible:ring-2 focus-visible:outline-none"
      onClick={onToggle}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onToggle();
      }}
    >
      {/* 2x2 thumbnail grid */}
      <div className="bg-muted grid h-12 w-12 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-lg border">
        {isExpired
          ? [0, 1, 2, 3].map(slot => (
              <div
                key={`placeholder-${slot}`}
                className="bg-muted-foreground/10 flex items-center justify-center"
              >
                {slot === 0 && (
                  <ImageIcon className="text-muted-foreground/40 h-3 w-3" />
                )}
              </div>
            ))
          : batch.images.slice(0, 4).map((img, i) =>
              img.original_image_url ? (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i} className="relative overflow-hidden">
                  <Image
                    src={getImageUrl(img.original_image_url)}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                    loading="lazy"
                    sizes="24px"
                  />
                </div>
              ) : (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i} className="bg-muted-foreground/10" />
              )
            )}
      </div>

      {/* Meta */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('text-xs font-semibold', cfg.color)}>
            {cfg.label}
          </span>
          {isExpired ? (
            <span className="bg-destructive/10 text-destructive rounded-full px-1.5 py-0.5 text-xs font-medium">
              Results expired
            </span>
          ) : null}
          <span className="text-muted-foreground text-sm">
            {batch.completed_count}/{batch.total_images} images
          </span>
          {batch.failed_count > 0 && (
            <span className="text-destructive text-xs">
              · {batch.failed_count} failed
            </span>
          )}
        </div>
        <p className="text-muted-foreground mt-0.5 truncate text-xs">
          <Clock className="mr-1 inline h-3 w-3" />
          {formatDate(batch.created_at)} · {langList}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <Link
          href={`/batch/${batch.batch_id}`}
          onClick={e => e.stopPropagation()}
          aria-label="View batch details"
          title="View details"
          className="focus-visible:ring-ring/50 text-muted-foreground hover:text-foreground rounded p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
        {completedImages.length > 0 && !isExpired && (
          <Button
            variant="ghost"
            size="icon"
            onClick={e => {
              e.stopPropagation();
              onDownloadAll();
            }}
            disabled={isZipping}
            aria-label="Download all as ZIP"
            className="h-8 w-8"
          >
            {isZipping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        )}
        <ChevronDown
          className={cn(
            'text-muted-foreground h-4 w-4 transition-transform duration-200',
            expanded && 'rotate-180'
          )}
        />
      </div>
    </div>
  );
}
