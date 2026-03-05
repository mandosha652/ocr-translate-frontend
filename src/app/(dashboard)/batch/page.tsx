'use client';
import { useQueryClient } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { QuotaBanner } from '@/components/features/upgrade/QuotaBanner';
import { UpgradeModal } from '@/components/features/upgrade/UpgradeModal';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useCancelBatch, useListBatches, useUsageStats } from '@/hooks';
import { useBatchCompletionNotifier } from '@/hooks/batch/useBatchCompletionNotifier';
import { getErrorMessage } from '@/lib/utils';

import { ActiveBatchCard } from './_components/active-batch-card';
import { BatchFormCard } from './_components/BatchFormCard';

export default function BatchPage() {
  const queryClient = useQueryClient();
  const cancelBatchMutation = useCancelBatch();
  const { data: usageStats } = useUsageStats();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const { data: batches, isLoading: isLoadingBatches } = useListBatches({
    enabled: true,
  });

  useBatchCompletionNotifier(batches);

  const activeBatches =
    batches?.filter(b => b.status === 'pending' || b.status === 'processing') ??
    [];

  const handleCancel = async (batchId: string) => {
    try {
      await cancelBatchMutation.mutateAsync(batchId);
      toast.success('Batch cancelled');
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Couldn't cancel the batch — please try again")
      );
    }
  };

  const handleBatchDone = () => {
    queryClient.invalidateQueries({ queryKey: ['batches'] });
  };

  return (
    <div className="space-y-8">
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        reason="You've reached your monthly batch limit. Upgrade to Pro for more."
      />
      {usageStats?.quota && <QuotaBanner quota={usageStats.quota} />}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Batch Translation</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Translate multiple images to multiple languages at once
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <BatchFormCard
            activeBatchCount={activeBatches.length}
            onBatchStarted={handleBatchDone}
            onUpgradeRequired={() => setUpgradeOpen(true)}
            maxBatchSize={usageStats?.quota?.images_per_batch}
          />
        </div>

        <div className="space-y-4">
          {isLoadingBatches && !batches ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
              </CardContent>
            </Card>
          ) : activeBatches.length > 0 ? (
            activeBatches.map(batch => (
              <ActiveBatchCard
                key={batch.batch_id}
                batch={batch}
                onCancel={() => handleCancel(batch.batch_id)}
                isCancelling={cancelBatchMutation.isPending}
                onDone={handleBatchDone}
              />
            ))
          ) : (
            <EmptyState
              icon={Inbox}
              title="No active batches"
              description="Start a new batch on the left to see it here"
              className="h-full min-h-50"
            />
          )}
        </div>
      </div>
    </div>
  );
}
