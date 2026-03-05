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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <CardTitle className="text-lg">Results Ready</CardTitle>
        </div>
        <CardDescription className="font-mono text-xs">
          {batch.batch_id.slice(0, 8)}...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 flex items-center justify-around rounded-lg p-4">
          <div className="flex flex-col items-center gap-1">
            <Images className="text-muted-foreground h-4 w-4" />
            <span className="text-lg font-semibold">{batch.total_images}</span>
            <span className="text-muted-foreground text-xs">images</span>
          </div>
          <div className="bg-border h-10 w-px" />
          <div className="flex flex-col items-center gap-1">
            <Languages className="text-muted-foreground h-4 w-4" />
            <span className="text-lg font-semibold">
              {batch.target_languages.length}
            </span>
            <span className="text-muted-foreground text-xs">languages</span>
          </div>
          {batch.failed_count > 0 && (
            <>
              <div className="bg-border h-10 w-px" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-semibold text-red-500">
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
