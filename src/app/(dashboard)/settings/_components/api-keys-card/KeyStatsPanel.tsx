'use client';

import { Calendar } from 'lucide-react';

import { useApiKeyStats } from '@/hooks';
import { formatExpiry } from '@/lib/utils/date';

interface KeyStatsPanelProps {
  keyId: string;
  expiresAt?: string;
}

export function KeyStatsPanel({ keyId, expiresAt }: KeyStatsPanelProps) {
  const { data, isLoading } = useApiKeyStats(keyId);

  if (isLoading) {
    return (
      <div className="mt-2 flex gap-2">
        <div className="bg-muted h-4 w-16 animate-pulse rounded-md" />
        <div className="bg-muted h-4 w-16 animate-pulse rounded-md" />
        <div className="bg-muted h-4 w-16 animate-pulse rounded-md" />
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: 'requests', value: data.total_requests },
    { label: 'images', value: data.total_images },
    { label: 'translations', value: data.total_translations },
  ];

  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        {stats.map(s => (
          <span
            key={s.label}
            className="bg-muted rounded-md px-2 py-0.5 text-xs"
          >
            <span className="font-medium tabular-nums">
              {s.value.toLocaleString()}
            </span>{' '}
            <span className="text-muted-foreground">{s.label}</span>
          </span>
        ))}
      </div>
      {expiresAt
        ? (() => {
            const expiry = formatExpiry(expiresAt);
            if (!expiry) return null;
            return (
              <p
                className={`mt-0.5 flex items-center gap-1 text-xs ${expiry.urgent ? 'text-amber-600' : 'text-muted-foreground'}`}
              >
                <Calendar className="h-3 w-3" />
                {expiry.label}
              </p>
            );
          })()
        : null}
    </>
  );
}
