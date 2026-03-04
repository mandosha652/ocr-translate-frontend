'use client';

import { AlertTriangle, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { UsageQuota } from '@/types';

interface Props {
  quota: UsageQuota;
}

function pct(used: number, limit: number | null): number {
  if (!limit) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

function nearLimit(used: number, limit: number | null): boolean {
  if (!limit) return false;
  return pct(used, limit) >= 80;
}

function atLimit(used: number, limit: number | null): boolean {
  if (!limit) return false;
  return used >= limit;
}

export function QuotaBanner({ quota }: Props) {
  const [dismissed, setDismissed] = useState(false);

  const imagesAt = atLimit(quota.images_used, quota.images_limit);
  const imagesNear = nearLimit(quota.images_used, quota.images_limit);
  const translationsAt = atLimit(
    quota.translations_used,
    quota.translations_limit
  );
  const translationsNear = nearLimit(
    quota.translations_used,
    quota.translations_limit
  );

  const isBlocked = imagesAt || translationsAt;
  const isWarning = !isBlocked && (imagesNear || translationsNear);

  if ((!isBlocked && !isWarning) || dismissed) return null;

  const label = isBlocked
    ? imagesAt
      ? `You've used all ${quota.images_limit} images this month.`
      : `You've used all ${quota.translations_limit} translations this month.`
    : imagesNear
      ? `${quota.images_used} of ${quota.images_limit} images used this month.`
      : `${quota.translations_used} of ${quota.translations_limit} translations used this month.`;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
        isBlocked
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-amber-300/50 bg-amber-50 text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-300'
      }`}
    >
      {isBlocked ? (
        <AlertTriangle className="h-4 w-4 shrink-0" />
      ) : (
        <Zap className="h-4 w-4 shrink-0" />
      )}
      <p className="flex-1">{label}</p>
      <Link href="/pricing">
        <Button
          size="xs"
          variant={isBlocked ? 'destructive' : 'outline'}
          className={
            isBlocked
              ? ''
              : 'border-amber-400 text-amber-800 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/30'
          }
        >
          Upgrade
        </Button>
      </Link>
      {!isBlocked && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30"
          onClick={() => setDismissed(true)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
