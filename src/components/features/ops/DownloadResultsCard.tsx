'use client';

import { CheckCircle2, Download, Images, Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Results Ready
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              {batch.batch_id.slice(0, 8)}...
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="bg-muted/40 flex items-center justify-around rounded-xl p-5">
          <div className="flex flex-col items-center gap-1.5">
            <Images className="text-muted-foreground h-4 w-4" />
            <span className="text-xl font-semibold tabular-nums">
              {batch.total_images}
            </span>
            <span className="text-muted-foreground text-xs">images</span>
          </div>
          <div className="bg-border h-12 w-px" />
          <div className="flex flex-col items-center gap-1.5">
            <Languages className="text-muted-foreground h-4 w-4" />
            <span className="text-xl font-semibold tabular-nums">
              {batch.target_languages.length}
            </span>
            <span className="text-muted-foreground text-xs">languages</span>
          </div>
          {batch.failed_count > 0 && (
            <>
              <div className="bg-border h-12 w-px" />
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-xl font-semibold text-red-500 tabular-nums">
                  {batch.failed_count}
                </span>
                <span className="text-muted-foreground text-xs">failed</span>
              </div>
            </>
          )}
        </div>

        <Button
          onClick={() => exportCsv()}
          disabled={!canExport || isPending}
          className="w-full"
          size="lg"
        >
          <Download className="mr-2 h-4 w-4" />
          {isPending ? 'Preparing...' : 'Download CSV'}
        </Button>

        {!canExport && (
          <p className="text-muted-foreground text-center text-xs">
            Waiting for captions to finish...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
