'use client';

import {
  AlertCircle,
  Clock,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';

import { TranslationJobResult } from '@/components/features/translate/TranslationJobResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { TranslationJobStatus } from '@/types';

import { TranslateProgressCard } from './TranslateProgressCard';

type PageState = 'idle' | 'submitting' | 'polling' | 'done' | 'error';
type InputMode = 'upload' | 'url';

interface TranslateResultPanelProps {
  pageState: PageState;
  inputMode: InputMode;
  jobStatus?: TranslationJobStatus;
  outputUrl: string | null;
  targetLang: string;
  errorMessage: string | null;
  hasInput: boolean;
  onReset: () => void;
}

export function TranslateResultPanel({
  pageState,
  inputMode,
  jobStatus,
  outputUrl,
  targetLang,
  errorMessage,
  hasInput,
  onReset,
}: TranslateResultPanelProps) {
  const isBusy = pageState === 'submitting' || pageState === 'polling';

  return (
    <div>
      {isBusy ? (
        <TranslateProgressCard
          pageState={pageState}
          inputMode={inputMode}
          jobStatus={jobStatus}
        />
      ) : null}

      {pageState === 'done' && outputUrl ? (
        <TranslationJobResult outputUrl={outputUrl} targetLang={targetLang} />
      ) : null}

      {pageState === 'error' && (
        <Card className="animate-in fade-in-0 border-destructive/50 duration-300">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <AlertCircle className="text-destructive mb-3 h-10 w-10" />
            <p className="font-medium">Translation failed</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {errorMessage ?? 'Something went wrong — please try again'}
            </p>
            <Button variant="outline" className="mt-4" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {pageState === 'idle' && (
        <EmptyState
          icon={ImageIcon}
          title="Your translated image will appear here"
          description="Upload an image or enter a URL, then select a target language"
        />
      )}

      {pageState === 'idle' && !hasInput && (
        <p className="text-muted-foreground mt-3 flex items-center justify-center gap-1.5 text-xs">
          <Clock className="h-3 w-3" />
          Jobs run asynchronously — results are ready in seconds
        </p>
      )}
    </div>
  );
}
