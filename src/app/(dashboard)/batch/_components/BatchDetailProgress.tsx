'use client';

import { Progress } from '@/components/ui/progress';

interface BatchDetailProgressProps {
  completedCount: number;
  failedCount: number;
  totalImages: number;
  progressValue: number;
}

export function BatchDetailProgress({
  completedCount,
  failedCount,
  totalImages,
  progressValue,
}: BatchDetailProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {completedCount} completed · {failedCount} failed ·{' '}
          {totalImages - completedCount - failedCount} remaining
        </span>
        <span className="font-semibold">{progressValue}%</span>
      </div>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
}
