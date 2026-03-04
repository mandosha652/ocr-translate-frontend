import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  useSubmitTranslationJob,
  useTranslationJob,
  useUsageStats,
} from '@/hooks';
import { getErrorMessage, isValidHttpUrl } from '@/lib/utils';

type PageState = 'idle' | 'submitting' | 'polling' | 'done' | 'error';
type InputMode = 'upload' | 'url';

export function useTranslatePage() {
  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceLang, setSourceLang] = useState('auto');
  const [jobId, setJobId] = useState<string | null>(null);
  const [pageState, setPageState] = useState<PageState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const submitMutation = useSubmitTranslationJob();
  const jobQuery = useTranslationJob(jobId);
  const { data: usageStats } = useUsageStats();

  const jobStatus = jobQuery.data?.status;
  const outputUrl = jobQuery.data?.output_url ?? null;

  useEffect(() => {
    if (pageState !== 'polling') return;
    if (jobStatus === 'completed' && outputUrl) {
      setPageState('done');
    } else if (jobStatus === 'failed') {
      setPageState('error');
      setErrorMessage(jobQuery.data?.error ?? 'Translation failed');
    }
  }, [pageState, jobStatus, outputUrl, jobQuery.data?.error]);

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
      const response = await submitMutation.mutateAsync({
        input,
        targetLanguage: targetLang,
        options:
          sourceLang === 'auto' ? undefined : { sourceLanguage: sourceLang },
      });

      setJobId(response.id);
      setPageState('polling');
      toast.success('Translation started, processing your image...');
    } catch (error) {
      const errorMsg = getErrorMessage(error, 'Failed to start translation');
      setErrorMessage(errorMsg);
      setPageState('error');

      const status = getErrorStatus(error);
      if (status === 402) {
        setUpgradeOpen(true);
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setImageUrl('');
    setJobId(null);
    setPageState('idle');
    setErrorMessage(null);
  };

  return {
    inputMode,
    setInputMode,
    file,
    setFile,
    imageUrl,
    setImageUrl,
    targetLang,
    setTargetLang,
    sourceLang,
    setSourceLang,
    pageState,
    errorMessage,
    upgradeOpen,
    setUpgradeOpen,
    isBusy,
    canSubmit,
    hasInput,
    jobQuery,
    usageStats,
    handleTranslate,
    handleReset,
  };
}

function getErrorStatus(error: unknown): number | null {
  if (error instanceof Error && 'response' in error) {
    return (error.response as any)?.status ?? null;
  }
  return null;
}
