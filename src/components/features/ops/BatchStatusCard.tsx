'use client';

import { Clock, Languages } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { TeamBatchStatus } from '@/types';
import { langName } from '@/types/language';

interface BatchStatusCardProps {
  batch: TeamBatchStatus;
}

const statusVariant: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'outline',
  processing: 'secondary',
  completed: 'default',
  partially_completed: 'secondary',
  failed: 'destructive',
  cancelled: 'outline',
};

export function BatchStatusCard({ batch }: BatchStatusCardProps) {
  const imagesPct =
    batch.total_images > 0
      ? Math.round((batch.completed_count / batch.total_images) * 100)
      : 0;

  const captionsPct = batch.captions_status === 'completed' ? 100 : 0;

  const isProcessing = ['pending', 'processing'].includes(batch.status);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-lg font-semibold">
            {isProcessing ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                <span className="bg-primary relative inline-flex h-2.5 w-2.5 rounded-full" />
              </span>
            ) : null}
            Batch Status
          </CardTitle>
          <Badge variant={statusVariant[batch.status] ?? 'outline'}>
            {batch.status.replace('_', ' ')}
          </Badge>
        </div>
        <CardDescription className="font-mono text-xs">
          {batch.batch_id.slice(0, 8)}...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Images</span>
            <span className="font-medium tabular-nums">
              {batch.completed_count} / {batch.total_images}
            </span>
          </div>
          <Progress value={imagesPct} className="h-2" />
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Captions</span>
            <span className="font-medium capitalize">
              {batch.captions_status}
            </span>
          </div>
          <Progress value={captionsPct} className="h-2" />
        </div>

        <div className="text-muted-foreground flex items-center gap-4 border-t pt-4 text-xs">
          <span className="flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5" />
            {batch.target_languages.map(langName).join(', ')}
          </span>
          {batch.failed_count > 0 && (
            <span className="flex items-center gap-1.5 text-red-500">
              <Clock className="h-3.5 w-3.5" />
              {batch.failed_count} failed
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
