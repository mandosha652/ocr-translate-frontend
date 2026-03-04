'use client';

import { CheckCircle2, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTeamExportCsv } from '@/hooks/useTeam';
import type { TeamBatchStatus } from '@/types';

interface DownloadResultsCardProps {
  batch: TeamBatchStatus;
}

export function DownloadResultsCard({ batch }: DownloadResultsCardProps) {
  const { mutate: exportCsv, isPending } = useTeamExportCsv(batch.batch_id);

  const canExport =
    ['completed', 'partially_completed'].includes(batch.status) &&
    batch.captions_status === 'completed';

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <p className="text-sm font-medium">Results ready</p>
      </div>

      <p className="text-muted-foreground text-xs">
        {batch.total_images} images × {batch.target_languages.length} languages
        {batch.failed_count > 0 && ` · ${batch.failed_count} failed`}
      </p>

      <Button
        onClick={() => exportCsv()}
        disabled={!canExport || isPending}
        className="w-full"
        variant="default"
      >
        <Download className="mr-2 h-4 w-4" />
        {isPending ? 'Preparing…' : 'Download CSV'}
      </Button>

      {!canExport && (
        <p className="text-muted-foreground text-center text-xs">
          Waiting for captions to finish…
        </p>
      )}
    </div>
  );
}
