'use client';

import { format } from 'date-fns';
import { Ban, Clock, Loader2 } from 'lucide-react';

import { getLangName } from '@/components/features/history/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BATCH_STATUS_CONFIG } from '@/lib/constants/ui';
import type { BatchStatusResponse } from '@/types';

interface BatchDetailHeaderProps {
  batch: BatchStatusResponse;
  isProcessing: boolean;
  isExpired: boolean;
  onCancel: () => void;
  isCancelling: boolean;
}

export function BatchDetailHeader({
  batch,
  isProcessing,
  isExpired,
  onCancel,
  isCancelling,
}: BatchDetailHeaderProps) {
  const cfg = BATCH_STATUS_CONFIG[batch.status];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant={cfg.variant}>{cfg.label}</Badge>
          {isExpired ? (
            <Badge variant="destructive">Results expired</Badge>
          ) : null}
        </div>
        <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <Clock className="h-3.5 w-3.5" />
          Created {format(new Date(batch.created_at), 'PPp')}
        </p>
        <p className="text-muted-foreground text-sm">
          Languages:{' '}
          <span className="text-foreground font-medium">
            {batch.target_languages.map(getLangName).join(', ')}
          </span>
        </p>
      </div>

      {isProcessing ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={onCancel}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Cancelling…
            </>
          ) : (
            <>
              <Ban className="mr-1.5 h-3.5 w-3.5" />
              Cancel Batch
            </>
          )}
        </Button>
      ) : null}
    </div>
  );
}
