'use client';

import { FileSpreadsheet, Inbox, Loader2, UploadCloud } from 'lucide-react';
import { notFound } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { BatchStatusCard } from '@/components/features/ops/BatchStatusCard';
import { CsvDropzone } from '@/components/features/ops/CsvDropzone';
import { DownloadResultsCard } from '@/components/features/ops/DownloadResultsCard';
import { RecentBatchesList } from '@/components/features/ops/RecentBatchesList';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
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

  const batchIsDone =
    activeBatch &&
    ['completed', 'partially_completed'].includes(activeBatch.status) &&
    activeBatch.captions_status === 'completed';

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Operations Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Upload CSV files to batch-translate images and captions
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left column: upload + history */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileSpreadsheet className="h-5 w-5" />
                    Upload CSV
                  </CardTitle>
                  <CardDescription>
                    Upload a CSV with image URLs, captions, and target languages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CsvDropzone onFile={setSelectedFile} disabled={uploading} />
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!selectedFile || uploading}
                    onClick={handleUpload}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Submit Batch
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Batches</CardTitle>
                  <CardDescription>
                    Select a batch to view its status or download results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingBatches ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
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
            <div className="space-y-6">
              {activeBatch && !batchIsDone && (
                <BatchStatusCard batch={activeBatch} />
              )}
              {activeBatch && batchIsDone && (
                <DownloadResultsCard batch={activeBatch} />
              )}
              {!activeBatch && (
                <EmptyState
                  icon={Inbox}
                  title="No batch selected"
                  description="Upload a CSV or select a batch from the list to see its status here"
                  className="h-full min-h-60"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
