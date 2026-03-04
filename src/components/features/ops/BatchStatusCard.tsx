'use client';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { TeamBatchStatus } from '@/types';

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

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="max-w-[60%] truncate text-sm font-medium">
          {batch.batch_id}
        </p>
        <Badge variant={statusVariant[batch.status] ?? 'outline'}>
          {batch.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>Images</span>
          <span>
            {batch.completed_count} / {batch.total_images}
          </span>
        </div>
        <Progress value={imagesPct} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>Captions</span>
          <span>{batch.captions_status}</span>
        </div>
        <Progress value={captionsPct} className="h-2" />
      </div>

      <p className="text-muted-foreground text-xs">
        Languages: {batch.target_languages.join(', ').toUpperCase()}
      </p>
    </div>
  );
}
