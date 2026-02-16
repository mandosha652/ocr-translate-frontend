'use client';
import { useState, useEffect } from 'react';
import { Loader2, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { historyStorage } from '@/lib/utils/historyStorage';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSelect } from '@/components/features/translate/LanguageSelect';
import {
  MultiImageUploader,
  MultiLanguageSelect,
  BatchProgress,
  BatchResults,
} from '@/components/features/batch';
import { useCreateBatch, useBatchStatus, useCancelBatch } from '@/hooks';

export default function BatchPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
  const [sourceLang, setSourceLang] = useState('auto');
  const [excludeText, setExcludeText] = useState('');
  const [batchId, setBatchId] = useState<string | null>(null);

  const createBatchMutation = useCreateBatch();
  const cancelBatchMutation = useCancelBatch();
  const { data: batchStatus, isLoading: isLoadingStatus } = useBatchStatus(
    batchId,
    { enabled: !!batchId }
  );

  const isFinished =
    batchStatus?.status === 'completed' ||
    batchStatus?.status === 'partially_completed' ||
    batchStatus?.status === 'failed' ||
    batchStatus?.status === 'cancelled';

  // Save to history when batch is finished
  useEffect(() => {
    if (isFinished && batchStatus && targetLanguages.length > 0) {
      historyStorage.addBatchTranslation(batchStatus, targetLanguages);
    }
  }, [isFinished, batchStatus, targetLanguages]);

  const handleStartBatch = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (targetLanguages.length === 0) {
      toast.error('Please select at least one target language');
      return;
    }

    try {
      const response = await createBatchMutation.mutateAsync({
        files,
        targetLanguages,
        options: {
          sourceLanguage: sourceLang !== 'auto' ? sourceLang : undefined,
          excludeText: excludeText || undefined,
        },
      });
      setBatchId(response.batch_id);
      toast.success(`Batch started with ${response.total_images} images`);
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string;
        error: string;
      }>;
      toast.error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          'Failed to start batch'
      );
    }
  };

  const handleCancel = async () => {
    if (!batchId) return;

    try {
      await cancelBatchMutation.mutateAsync(batchId);
      toast.success('Batch cancelled');
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string;
        error: string;
      }>;
      toast.error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          'Failed to cancel batch'
      );
    }
  };

  const handleNewBatch = () => {
    setFiles([]);
    setTargetLanguages([]);
    setSourceLang('auto');
    setExcludeText('');
    setBatchId(null);
  };

  const showSetup = !batchId || (!isLoadingStatus && !batchStatus);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Batch Translation</h1>
        <p className="text-muted-foreground mt-2">
          Translate multiple images to multiple languages at once
        </p>
      </div>

      {showSetup ? (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>
                Select up to 20 images to translate in batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultiImageUploader
                onFilesChange={setFiles}
                selectedFiles={files}
                disabled={createBatchMutation.isPending}
              />
            </CardContent>
          </Card>

          {/* Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle>Translation Settings</CardTitle>
              <CardDescription>
                Configure languages and options for this batch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <LanguageSelect
                value={sourceLang}
                onChange={setSourceLang}
                label="Source Language"
                placeholder="Auto-detect"
                showAuto
                disabled={createBatchMutation.isPending}
              />

              <MultiLanguageSelect
                selectedLanguages={targetLanguages}
                onChange={setTargetLanguages}
                label="Target Languages"
                disabled={createBatchMutation.isPending}
              />

              <div className="space-y-2">
                <Label htmlFor="excludeText">Exclude Text (optional)</Label>
                <Input
                  id="excludeText"
                  placeholder="e.g., BRAND,@handle,Logo"
                  value={excludeText}
                  onChange={e => setExcludeText(e.target.value)}
                  disabled={createBatchMutation.isPending}
                />
                <p className="text-muted-foreground text-xs">
                  Comma-separated text patterns to exclude from translation
                </p>
              </div>

              <Button
                onClick={handleStartBatch}
                disabled={
                  files.length === 0 ||
                  targetLanguages.length === 0 ||
                  createBatchMutation.isPending
                }
                className="w-full"
                size="lg"
              >
                {createBatchMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Batch...
                  </>
                ) : (
                  <>
                    <Layers className="mr-2 h-4 w-4" />
                    Start Batch Translation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {isLoadingStatus && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
                <p className="text-muted-foreground mt-4">
                  Loading batch status...
                </p>
              </CardContent>
            </Card>
          )}

          {batchStatus && (
            <>
              <BatchProgress
                batchStatus={batchStatus}
                onCancel={handleCancel}
                isCancelling={cancelBatchMutation.isPending}
              />

              {isFinished && <BatchResults batchStatus={batchStatus} />}

              {isFinished && (
                <div className="flex justify-center">
                  <Button onClick={handleNewBatch} size="lg">
                    <Layers className="mr-2 h-4 w-4" />
                    Start New Batch
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
