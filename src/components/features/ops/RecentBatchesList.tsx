'use client';

import { formatDistanceToNowStrict } from 'date-fns';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTeamExportCsv } from '@/hooks/useTeam';
import { cn } from '@/lib/utils';
import type { TeamBatchSummary } from '@/types';
import { langName } from '@/types/language';

interface RecentBatchesListProps {
  batches: TeamBatchSummary[];
  onSelect: (batchId: string) => void;
  selectedId: string | null;
  loading?: boolean;
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
      className="h-8 w-8 shrink-0"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

export function RecentBatchesList({
  batches,
  onSelect,
  selectedId,
  loading,
}: RecentBatchesListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="bg-muted mb-3 flex h-11 w-11 items-center justify-center rounded-full">
          <FileSpreadsheet className="text-muted-foreground h-4.5 w-4.5" />
        </div>
        <p className="text-sm font-medium">No batches yet</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Upload a CSV to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {batches.map(batch => {
        const isSelected = selectedId === batch.batch_id;
        return (
          <div
            key={batch.batch_id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(batch.batch_id)}
            onKeyDown={e => e.key === 'Enter' && onSelect(batch.batch_id)}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all duration-150',
              'hover:bg-muted/40',
              isSelected && 'border-primary bg-primary/5 shadow-sm'
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground truncate font-mono text-xs">
                  {batch.batch_id.slice(0, 8)}...
                </p>
                <span className="text-muted-foreground/50 text-[10px]">
                  {formatDistanceToNowStrict(new Date(batch.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="text-muted-foreground mt-1.5 flex items-center gap-2 text-xs">
                <span>{batch.total_images} images</span>
                <span className="text-muted-foreground/40">·</span>
                <span>{batch.target_languages.map(langName).join(', ')}</span>
                {batch.failed_count > 0 && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-red-500">
                      {batch.failed_count} failed
                    </span>
                  </>
                )}
              </div>
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
        );
      })}
    </div>
  );
}
