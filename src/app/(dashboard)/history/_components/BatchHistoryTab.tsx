'use client';

import { BatchCard } from '@/components/features/history/BatchCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import type { BatchStatusResponse } from '@/types';

function CardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

interface BatchHistoryTabProps {
  batches: BatchStatusResponse[];
  isLoading: boolean;
  searchQuery: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BatchHistoryTab({
  batches,
  isLoading,
  searchQuery,
  page,
  totalPages,
  onPageChange,
}: BatchHistoryTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <EmptyState
        title={
          searchQuery
            ? 'No results match your search'
            : 'No batch translations yet'
        }
      />
    );
  }

  return (
    <>
      <div className="space-y-2">
        {batches.map(batch => (
          <BatchCard key={batch.batch_id} batch={batch} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="text-muted-foreground text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
