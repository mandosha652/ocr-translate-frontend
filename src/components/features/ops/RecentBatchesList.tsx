'use client';

import { Download, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTeamExportCsv } from '@/hooks/useTeam';
import type { TeamBatchSummary } from '@/types';

interface RecentBatchesListProps {
  batches: TeamBatchSummary[];
  onSelect: (batchId: string) => void;
  selectedId: string | null;
}

const statusVariant: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'outline',
  processing: 'secondary',
  completed: 'default',
  partially_completed: 'secondary',
  failed: 'destructive',
  cancelled: 'outline',
};

function ExportButton({ batchId }: { batchId: string }) {
  const { mutate, isPending } = useTeamExportCsv(batchId);
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={e => {
        e.stopPropagation();
        mutate();
      }}
      disabled={isPending}
      title="Download CSV"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
}

export function RecentBatchesList({
  batches,
  onSelect,
  selectedId,
}: RecentBatchesListProps) {
  if (batches.length === 0) {
    return (
      <p className="text-muted-foreground py-6 text-center text-sm">
        No batches yet. Upload a CSV to get started.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {batches.map(batch => (
        <div
          key={batch.batch_id}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(batch.batch_id)}
          onKeyDown={e => e.key === 'Enter' && onSelect(batch.batch_id)}
          className={`hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
            selectedId === batch.batch_id ? 'border-primary bg-muted/30' : ''
          }`}
        >
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground truncate font-mono text-xs">
              {batch.batch_id.slice(0, 8)}…
            </p>
            <p className="mt-0.5 text-xs">
              {batch.total_images} images ·{' '}
              {batch.target_languages.join(', ').toUpperCase()}
            </p>
          </div>
          <Badge
            variant={statusVariant[batch.status] ?? 'outline'}
            className="shrink-0 text-xs"
          >
            {batch.status.replace('_', ' ')}
          </Badge>
          {['completed', 'partially_completed'].includes(batch.status) && (
            <ExportButton batchId={batch.batch_id} />
          )}
        </div>
      ))}
    </div>
  );
}
