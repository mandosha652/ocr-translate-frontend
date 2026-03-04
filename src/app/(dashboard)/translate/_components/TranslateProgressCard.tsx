'use client';

import { CheckCircle2, Loader2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { TranslationJobStatus } from '@/types';

const STATUS_LABELS: Record<TranslationJobStatus, string> = {
  pending: 'Queued — waiting for a worker…',
  processing: 'Processing — translating text and rendering…',
  completed: 'Complete',
  failed: 'Failed',
};

const STATUS_STEPS = [
  { key: 'submitting', label: 'Uploading image' },
  { key: 'pending', label: 'Queued' },
  { key: 'processing', label: 'Translating & rendering' },
  { key: 'done', label: 'Done' },
] as const;

type PageState = 'idle' | 'submitting' | 'polling' | 'done' | 'error';
type InputMode = 'upload' | 'url';

function currentStepIndex(
  pageState: PageState,
  jobStatus?: TranslationJobStatus
) {
  if (pageState === 'submitting') return 0;
  if (pageState === 'polling') {
    if (jobStatus === 'pending') return 1;
    if (jobStatus === 'processing') return 2;
  }
  if (pageState === 'done') return 3;
  return 0;
}

interface TranslateProgressCardProps {
  pageState: PageState;
  inputMode: InputMode;
  jobStatus?: TranslationJobStatus;
}

export function TranslateProgressCard({
  pageState,
  inputMode,
  jobStatus,
}: TranslateProgressCardProps) {
  const stepIndex = currentStepIndex(pageState, jobStatus);

  return (
    <Card className="animate-in fade-in-0 duration-300">
      <CardContent className="py-10">
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="bg-primary/10 absolute inset-0 animate-ping rounded-full" />
            <Loader2 className="text-primary relative h-10 w-10 animate-spin" />
          </div>
          <p className="font-medium">
            {pageState === 'submitting'
              ? inputMode === 'url'
                ? 'Fetching image from URL…'
                : 'Uploading image…'
              : STATUS_LABELS[jobStatus ?? 'pending']}
          </p>
        </div>

        <ol className="space-y-3">
          {STATUS_STEPS.map((step, i) => {
            const isDone = i < stepIndex;
            const isActive = i === stepIndex;
            return (
              <li key={step.key} className="flex items-center gap-3">
                <span
                  className={[
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    isDone
                      ? 'bg-primary text-primary-foreground'
                      : isActive
                        ? 'border-primary text-primary border-2'
                        : 'bg-muted text-muted-foreground',
                  ].join(' ')}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={[
                    'text-sm',
                    isDone
                      ? 'text-foreground'
                      : isActive
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground',
                  ].join(' ')}
                >
                  {step.label}
                </span>
                {isActive && (
                  <Loader2 className="text-primary ml-auto h-4 w-4 animate-spin" />
                )}
                {isDone && (
                  <CheckCircle2 className="text-primary ml-auto h-4 w-4" />
                )}
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
