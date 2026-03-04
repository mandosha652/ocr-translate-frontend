'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BatchDetailProgressProps {
  completedCount: number;
  failedCount: number;
  totalImages: number;
  showProgress: boolean;
}

export function BatchDetailProgress({
  completedCount,
  failedCount,
  totalImages,
  showProgress,
}: BatchDetailProgressProps) {
  if (!showProgress) return null;

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-orange-600">
          Processing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="text-muted-foreground mb-1 flex justify-between text-xs">
              <span>Progress</span>
              <span>
                {completedCount} / {totalImages}
              </span>
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${totalImages > 0 ? (completedCount / totalImages) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
          {failedCount > 0 && (
            <div>
              <div className="text-muted-foreground mb-1 flex justify-between text-xs">
                <span>Failed</span>
                <span className="text-red-500">
                  {failedCount} / {totalImages}
                </span>
              </div>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full bg-red-500 transition-all"
                  style={{
                    width: `${totalImages > 0 ? (failedCount / totalImages) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
