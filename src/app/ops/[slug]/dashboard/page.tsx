'use client';

import {
  Download,
  FileSpreadsheet,
  Inbox,
  Loader2,
  LogOut,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { BatchStatusCard } from '@/components/features/ops/BatchStatusCard';
import { CsvDropzone } from '@/components/features/ops/CsvDropzone';
import {
  CsvPreview,
  validateCsvFile,
} from '@/components/features/ops/CsvPreview';
import { DownloadResultsCard } from '@/components/features/ops/DownloadResultsCard';
import { FailedImagesCard } from '@/components/features/ops/FailedImagesCard';
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
  useTeamCancelBatch,
  useTeamLogout,
  useTeamUploadCsv,
} from '@/hooks/useTeam';
import { TEAM_SLUG } from '@/lib/constants';
import { SUPPORTED_LANGUAGES } from '@/types/language';
import type { TeamBatchStatus } from '@/types/team';

function ActiveBatchPanel({
  activeBatch,
  onCancel,
  cancelling,
}: {
  activeBatch: TeamBatchStatus | undefined;
  onCancel: () => void;
  cancelling: boolean;
}) {
  if (!activeBatch) {
    return (
      <EmptyState
        icon={Inbox}
        title="No batch selected"
        description="Upload a CSV or select a batch from the list to see its status here"
        className="h-full min-h-64"
      />
    );
  }

  const batchIsDone =
    ['completed', 'partially_completed'].includes(activeBatch.status) &&
    activeBatch.captions_status === 'completed';

  const batchIsActive = ['pending', 'processing'].includes(activeBatch.status);

  return (
    <div className="space-y-8">
      {!batchIsDone ? (
        <div className="space-y-4">
          <BatchStatusCard batch={activeBatch} />
          {batchIsActive ? (
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={onCancel}
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Batch
                </>
              )}
            </Button>
          ) : null}
        </div>
      ) : null}
      {batchIsDone ? <DownloadResultsCard batch={activeBatch} /> : null}
      {activeBatch.images && activeBatch.failed_count > 0 ? (
        <FailedImagesCard images={activeBatch.images} />
      ) : null}
    </div>
  );
}

const CSV_TEMPLATE =
  'image_url,caption,source_lang,target_langs\nhttps://example.com/image1.jpg,"Product title here",en,de;fr\nhttps://example.com/image2.png,"Another caption",auto,es;it;pt\n';

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'imgtext-batch-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

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
  const [csvValid, setCsvValid] = useState(false);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);

  const { mutate: upload, isPending: uploading } = useTeamUploadCsv();
  const { data: batchList, isPending: loadingBatches } = useTeamBatches();
  const { data: activeBatch } = useTeamBatchStatus(activeBatchId);
  const { mutate: logout, isPending: loggingOut } = useTeamLogout();
  const { mutate: cancelBatch, isPending: cancelling } = useTeamCancelBatch();

  const handleFileSelected = useCallback(async (file: File) => {
    setSelectedFile(file);
    const valid = await validateCsvFile(file);
    setCsvValid(valid);
  }, []);

  const handleUpload = () => {
    if (!selectedFile) return;
    upload(selectedFile, {
      onSuccess: data => {
        toast.success(`Batch created — ${data.image_count} images queued`);
        setActiveBatchId(data.batch_id);
        setSelectedFile(null);
        setCsvValid(false);
      },
      onError: () => {
        toast.error('Upload failed. Check your CSV format and try again.');
      },
    });
  };

  const handleCancel = () => {
    if (!activeBatchId) return;
    cancelBatch(activeBatchId, {
      onSuccess: () => {
        toast.success('Batch cancelled');
      },
      onError: () => {
        toast.error('Failed to cancel batch');
      },
    });
  };

  // Toast when a batch reaches a terminal state
  const notifiedRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!activeBatch) return;
    const { batch_id, status } = activeBatch;
    if (['pending', 'processing'].includes(status)) return;
    if (notifiedRef.current.has(batch_id)) return;
    notifiedRef.current.add(batch_id);

    if (status === 'completed') {
      toast.success(`Batch ${batch_id.slice(0, 8)} completed`);
    } else if (status === 'partially_completed') {
      toast.warning(
        `Batch ${batch_id.slice(0, 8)} completed with ${activeBatch.failed_count} failures`
      );
    } else if (status === 'failed') {
      toast.error(`Batch ${batch_id.slice(0, 8)} failed`);
    }
  }, [activeBatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 via-white to-gray-50/40 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-950">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="space-y-8 sm:space-y-10">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Operations Dashboard
              </h1>
              <p className="text-muted-foreground text-sm sm:text-[15px]">
                Upload CSV files to batch-translate images and captions
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              disabled={loggingOut}
              className="text-muted-foreground hover:text-foreground -mr-2"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {loggingOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left column: upload + history */}
            <div className="space-y-8">
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5 text-lg font-semibold">
                      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                        <FileSpreadsheet className="text-primary h-4 w-4" />
                      </div>
                      Upload CSV
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadTemplate}
                      className="h-8 text-xs"
                    >
                      <Download className="mr-1.5 h-3 w-3" />
                      Template
                    </Button>
                  </div>
                  <CardDescription className="mt-1.5">
                    Upload a CSV with image URLs, captions, and target languages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <CsvDropzone
                    file={selectedFile}
                    onFile={handleFileSelected}
                    disabled={uploading}
                  />

                  <details className="group" suppressHydrationWarning>
                    <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-xs transition-colors select-none">
                      Language codes reference
                    </summary>
                    <div className="mt-3 grid grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <div
                          key={lang.code}
                          className="flex items-center gap-1.5"
                        >
                          <code className="bg-muted rounded-md px-1.5 py-0.5 font-mono text-[10px]">
                            {lang.code}
                          </code>
                          <span className="text-muted-foreground">
                            {lang.name}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center gap-1.5">
                        <code className="bg-muted rounded-md px-1.5 py-0.5 font-mono text-[10px]">
                          auto
                        </code>
                        <span className="text-muted-foreground">
                          Auto-detect
                        </span>
                      </div>
                    </div>
                  </details>

                  {selectedFile ? <CsvPreview file={selectedFile} /> : null}

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!selectedFile || !csvValid || uploading}
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

              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Recent Batches
                  </CardTitle>
                  <CardDescription>
                    Select a batch to view its status or download results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentBatchesList
                    batches={batchList?.batches ?? []}
                    onSelect={setActiveBatchId}
                    selectedId={activeBatchId}
                    loading={loadingBatches}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right column: active job status + download */}
            <ActiveBatchPanel
              activeBatch={activeBatch}
              onCancel={handleCancel}
              cancelling={cancelling}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
