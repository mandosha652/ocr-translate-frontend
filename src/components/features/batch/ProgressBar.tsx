'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  progressValue: number;
  completedCount: number;
  failedCount: number;
  totalImages: number;
  estimatedTimeRemaining: string | null;
}

export function ProgressBar({
  progressValue,
  completedCount,
  failedCount,
  totalImages,
  estimatedTimeRemaining,
}: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-1 text-sm">
        <span className="text-muted-foreground font-medium">
          {completedCount} completed · {failedCount} failed ·{' '}
          {totalImages - completedCount - failedCount} remaining
          {estimatedTimeRemaining ? (
            <span className="ml-2">· {estimatedTimeRemaining}</span>
          ) : null}
        </span>
        <span className="font-semibold">{progressValue}%</span>
      </div>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
}
