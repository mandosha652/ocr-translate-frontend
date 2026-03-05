'use client';

import {
  AlertCircle,
  Layers,
  Link as LinkIcon,
  Loader2,
  Upload,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import {
  BatchUrlInput,
  MultiImageUploader,
  MultiLanguageSelect,
} from '@/components/features/batch';
import { LanguageSelect } from '@/components/features/translate/LanguageSelect';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBatchFormSubmit } from '@/hooks';
import {
  FREE_TIER_MAX_TARGET_LANGUAGES,
  MAX_BATCH_SIZE,
  MAX_CONCURRENT_BATCHES,
  PRO_TIER_MAX_TARGET_LANGUAGES,
} from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';

import { BatchExcludeInput } from './BatchExcludeInput';
import { BatchWebhookInput, isWebhookUrlValid } from './BatchWebhookInput';

type InputMode = 'upload' | 'url';

interface BatchFormCardProps {
  activeBatchCount: number;
  onBatchStarted: () => void;
  onUpgradeRequired: () => void;
  maxBatchSize?: number;
}

export function BatchFormCard({
  activeBatchCount,
  onBatchStarted,
  onUpgradeRequired,
  maxBatchSize = MAX_BATCH_SIZE,
}: BatchFormCardProps) {
  const { user } = useAuthStore();
  const maxTargetLanguages =
    user?.tier === 'pro' || user?.tier === 'enterprise'
      ? PRO_TIER_MAX_TARGET_LANGUAGES
      : FREE_TIER_MAX_TARGET_LANGUAGES;

  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
  const [sourceLang, setSourceLang] = useState('auto');
  const [excludeText, setExcludeText] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const atConcurrentLimit = activeBatchCount >= MAX_CONCURRENT_BATCHES;
  const isWebhookValid = webhookUrl.trim()
    ? isWebhookUrlValid(webhookUrl)
    : true;

  const resetForm = useCallback(() => {
    setFiles([]);
    setImageUrls(['']);
    setInputMode('upload');
    setTargetLanguages([]);
    setSourceLang('auto');
    setExcludeText('');
    setWebhookUrl('');
  }, []);

  const { handleStartBatch, isPending, hasInput } = useBatchFormSubmit({
    inputMode,
    files,
    imageUrls,
    targetLanguages,
    sourceLang,
    excludeText,
    webhookUrl,
    isWebhookValid,
    activeBatchCount,
    onBatchStarted,
    onUpgradeRequired,
    resetForm,
    maxTargetLanguages,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Batch</CardTitle>
        <CardDescription>
          Upload images or provide public URLs and configure translation
          settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Tabs
          value={inputMode}
          onValueChange={(v: string) => {
            setInputMode(v as InputMode);
            setFiles([]);
            setImageUrls(['']);
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled={isPending}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url" disabled={isPending}>
              <LinkIcon className="mr-2 h-4 w-4" />
              URL
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-4">
            <MultiImageUploader
              onFilesChange={setFiles}
              selectedFiles={files}
              disabled={isPending}
              maxBatchSize={maxBatchSize}
            />
          </TabsContent>
          <TabsContent value="url" className="mt-4">
            <BatchUrlInput
              urls={imageUrls}
              onChange={setImageUrls}
              disabled={isPending}
              maxBatchSize={maxBatchSize}
            />
          </TabsContent>
        </Tabs>

        <LanguageSelect
          value={sourceLang}
          onChange={setSourceLang}
          label="Source Language"
          placeholder="Auto-detect"
          showAuto
          disabled={isPending}
        />

        <MultiLanguageSelect
          selectedLanguages={targetLanguages}
          onChange={setTargetLanguages}
          label="Target Languages"
          disabled={isPending}
          maxLanguages={maxTargetLanguages}
        />

        <BatchExcludeInput
          value={excludeText}
          onChange={setExcludeText}
          disabled={isPending}
        />
        <BatchWebhookInput
          value={webhookUrl}
          onChange={setWebhookUrl}
          disabled={isPending}
        />

        {atConcurrentLimit ? (
          <div className="text-muted-foreground flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {activeBatchCount} batch
              {activeBatchCount !== 1 ? 'es' : ''} already running — wait for
              one to finish
            </span>
          </div>
        ) : null}

        <Button
          onClick={handleStartBatch}
          disabled={
            !hasInput ||
            targetLanguages.length === 0 ||
            isPending ||
            atConcurrentLimit ||
            !isWebhookValid
          }
          className="w-full"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting…
            </>
          ) : (
            <>
              <Layers className="mr-2 h-4 w-4" />
              Start Batch
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
