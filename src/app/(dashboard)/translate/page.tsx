'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { QuotaBanner } from '@/components/features/upgrade/QuotaBanner';
import { UpgradeModal } from '@/components/features/upgrade/UpgradeModal';
import {
  useAuth,
  useSubmitTranslationJob,
  useTranslationJob,
  useUsageStats,
} from '@/hooks';
import { getErrorMessage, getErrorStatus, isValidHttpUrl } from '@/lib/utils';

import { TranslateFormCard } from './_components/TranslateFormCard';
import { TranslateResultPanel } from './_components/TranslateResultPanel';

type PageState = 'idle' | 'submitting' | 'polling' | 'done' | 'error';
type InputMode = 'upload' | 'url';

export default function TranslatePage() {
  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceLang, setSourceLang] = useState('auto');
  const [jobId, setJobId] = useState<string | null>(null);
  const [pageState, setPageState] = useState<PageState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const { user } = useAuth();
  const submitMutation = useSubmitTranslationJob();
  const jobQuery = useTranslationJob(jobId);
  const { data: usageStats } = useUsageStats();

  const jobStatus = jobQuery.data?.status;
  const outputUrl = jobQuery.data?.output_url ?? null;

  if (pageState === 'polling') {
    if (jobStatus === 'completed' && outputUrl) {
      setPageState('done');
    } else if (jobStatus === 'failed') {
      setPageState('error');
      setErrorMessage(jobQuery.data?.error ?? 'Translation failed');
    }
  }

  const isBusy = pageState === 'submitting' || pageState === 'polling';

  const canSubmit =
    !isBusy &&
    (inputMode === 'upload' ? !!file : isValidHttpUrl(imageUrl.trim()));

  const hasInput = inputMode === 'upload' ? !!file : !!imageUrl.trim();

  const handleTranslate = async () => {
    const input =
      inputMode === 'upload'
        ? file
          ? { file }
          : null
        : isValidHttpUrl(imageUrl.trim())
          ? { imageUrl: imageUrl.trim() }
          : null;

    if (!input) {
      toast.error(
        inputMode === 'upload'
          ? 'Select an image to translate'
          : 'Enter a valid image URL starting with https://'
      );
      return;
    }

    setPageState('submitting');
    setErrorMessage(null);
    setJobId(null);

    try {
      const job = await submitMutation.mutateAsync({
        input,
        targetLanguage: targetLang,
        options: {
          sourceLanguage: sourceLang !== 'auto' ? sourceLang : undefined,
        },
      });
      setJobId(job.id);
      setPageState('polling');
    } catch (error) {
      const status = getErrorStatus(error);
      if (status === 402 || status === 429) {
        setPageState('idle');
        setUpgradeOpen(true);
        return;
      }
      const msg = getErrorMessage(
        error,
        "Couldn't start the translation — please try again"
      );
      setPageState('error');
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleReset = () => {
    setFile(null);
    setImageUrl('');
    setJobId(null);
    setPageState('idle');
    setErrorMessage(null);
    setTargetLang('en');
    setSourceLang('auto');
    submitMutation.reset();
  };

  const handleCancel = () => {
    setPageState('idle');
    setJobId(null);
    submitMutation.reset();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        reason="You've reached your monthly translation limit. Upgrade to Pro for more."
      />
      {usageStats?.quota ? <QuotaBanner quota={usageStats.quota} /> : null}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Translate Image</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Upload an image or paste a URL — get back a new image with the text
          translated in place
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <TranslateFormCard
          inputMode={inputMode}
          onInputModeChange={setInputMode}
          file={file}
          onFileSelect={setFile}
          imageUrl={imageUrl}
          onImageUrlChange={setImageUrl}
          targetLang={targetLang}
          onTargetLangChange={setTargetLang}
          sourceLang={sourceLang}
          onSourceLangChange={setSourceLang}
          pageState={pageState}
          isBusy={isBusy}
          hasInput={hasInput}
          canSubmit={canSubmit}
          isVerified={user?.is_verified ?? true}
          onTranslate={handleTranslate}
          onCancel={handleCancel}
          onReset={handleReset}
        />

        <TranslateResultPanel
          pageState={pageState}
          inputMode={inputMode}
          jobStatus={jobStatus}
          outputUrl={outputUrl}
          targetLang={targetLang}
          errorMessage={errorMessage}
          hasInput={hasInput}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
