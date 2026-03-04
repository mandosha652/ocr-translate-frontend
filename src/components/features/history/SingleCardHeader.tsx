'use client';

import { ChevronDown, Clock, Download, ExternalLink } from 'lucide-react';
import { useId } from 'react';

import { cn, getImageUrl } from '@/lib/utils';
import type { SingleTranslationRecord } from '@/types';

import { downloadFile, formatDate, getLangName } from './utils';

interface SingleCardHeaderProps {
  item: SingleTranslationRecord;
  expanded: boolean;
  onToggle: () => void;
}

export function SingleCardHeader({
  item,
  expanded,
  onToggle,
}: SingleCardHeaderProps) {
  const panelId = useId();
  const isExpired = item.is_expired;

  return (
    <button
      aria-expanded={expanded}
      aria-controls={panelId}
      className="focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-3 p-4 text-left focus-visible:ring-2 focus-visible:outline-none"
      onClick={onToggle}
    >
      <div className="text-xs font-medium tracking-wide uppercase">
        {item.source_lang ? `${getLangName(item.source_lang)} → ` : ''}
        {getLangName(item.target_lang)}
      </div>
      {isExpired && (
        <span className="bg-destructive/10 text-destructive rounded-full px-1.5 py-0.5 text-xs font-medium">
          Expired
        </span>
      )}
      <p className="text-muted-foreground flex items-center gap-1 text-xs">
        <Clock className="h-3 w-3" />
        {formatDate(item.created_at)}
      </p>

      <div className="flex shrink-0 items-center gap-1">
        {!isExpired && (
          <>
            <a
              href={getImageUrl(item.translated_image_url)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open translated image"
              title="Open translated image"
              onClick={e => e.stopPropagation()}
              className="focus-visible:ring-ring/50 text-muted-foreground hover:text-foreground rounded p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              aria-label="Download translated image"
              title="Download translated image"
              onClick={e => {
                e.stopPropagation();
                downloadFile(
                  getImageUrl(item.translated_image_url),
                  `translated-${item.target_lang}.png`
                );
              }}
              className="focus-visible:ring-ring/50 text-muted-foreground hover:text-foreground cursor-pointer rounded p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </>
        )}
        <ChevronDown
          className={cn(
            'text-muted-foreground h-4 w-4 transition-transform duration-200',
            expanded && 'rotate-180'
          )}
        />
      </div>
    </button>
  );
}
