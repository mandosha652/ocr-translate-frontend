'use client';

import { Loader2, UploadCloud } from 'lucide-react';
import { notFound } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { BatchStatusCard } from '@/components/features/ops/BatchStatusCard';
import { CsvDropzone } from '@/components/features/ops/CsvDropzone';
import { DownloadResultsCard } from '@/components/features/ops/DownloadResultsCard';
import { RecentBatchesList } from '@/components/features/ops/RecentBatchesList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useTeamBatches,
  useTeamBatchStatus,
  useTeamUploadCsv,
} from '@/hooks/useTeam';
import { TEAM_SLUG } from '@/lib/constants';

export default function TeamDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  if (slug !== TEAM_SLUG) {
    notFound();
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);

  const { mutate: upload, isPending: uploading } = useTeamUploadCsv();
  const { data: batchList, isLoading: loadingBatches } = useTeamBatches();
  const { data: activeBatch } = useTeamBatchStatus(activeBatchId);

  const handleUpload = () => {
    if (!selectedFile) return;
    upload(selectedFile, {
      onSuccess: data => {
        toast.success(`Batch created — ${data.image_count} images queued`);
        setActiveBatchId(data.batch_id);
        setSelectedFile(null);
      },
      onError: () => {
        toast.error('Upload failed. Check your CSV format and try again.');
      },
    });
  };

  const rightPanel = (
    <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
      <UploadCloud className="mb-3 h-8 w-8" />
      <p className="text-sm">Upload a CSV to see results here</p>
      <p className="mt-1 text-xs">
        Select a batch from the list to view its status
      </p>
    </div>
  );

  const batchIsDone =
    activeBatch &&
    ['completed', 'partially_completed'].includes(activeBatch.status) &&
    activeBatch.captions_status === 'completed';

  return (
    <div className="bg-muted/20 min-h-screen p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Team Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left column: upload + history */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload CSV</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CsvDropzone onFile={setSelectedFile} disabled={uploading} />
                <Button
                  className="w-full"
                  disabled={!selectedFile || uploading}
                  onClick={handleUpload}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Batches</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingBatches ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                  </div>
                ) : (
                  <RecentBatchesList
                    batches={batchList?.batches ?? []}
                    onSelect={setActiveBatchId}
                    selectedId={activeBatchId}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column: active job status + download */}
          <div className="space-y-4">
            {activeBatch && !batchIsDone && (
              <BatchStatusCard batch={activeBatch} />
            )}
            {activeBatch && batchIsDone && (
              <DownloadResultsCard batch={activeBatch} />
            )}
            {!activeBatch && rightPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
