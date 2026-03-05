'use client';

import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Layers,
  Search,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminBatches, useAdminResumeStuckBatches } from '@/hooks';

import { BatchRow, BatchRowSkeleton } from './_components/BatchRow';

const PAGE_SIZE = 20;

function PageHeader({
  total,
  isPending,
  onResumeStuck,
}: {
  total?: number;
  isPending: boolean;
  onResumeStuck: () => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">Batches</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {total !== null && total !== undefined
            ? `${total.toLocaleString()} total batches`
            : 'All platform batches'}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onResumeStuck}
        disabled={isPending}
        className="gap-1.5"
      >
        <Zap
          className={`h-3.5 w-3.5 ${isPending ? 'animate-pulse text-yellow-500' : ''}`}
        />
        {isPending ? 'Queuing...' : 'Resume Stuck'}
      </Button>
    </div>
  );
}

function FilterControls({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}) {
  return (
    <CardHeader className="pb-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Filter by tenant ID..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9"
            autoComplete="off"
          />
        </div>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="partially_completed">Partial</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardHeader>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <BatchRowSkeleton key={i} />
      ))}
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-12">
      <div className="bg-destructive/10 rounded-full p-3">
        <AlertTriangle className="text-destructive h-5 w-5" />
      </div>
      <p className="text-destructive font-medium">Failed to load batches</p>
      <p className="text-muted-foreground text-sm">
        Check your admin key and try again
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-12">
      <Layers className="text-muted-foreground/40 h-10 w-10" />
      <p className="text-muted-foreground text-sm">
        No batches found matching your filters
      </p>
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  total,
  offset,
  onPrevClick,
  onNextClick,
}: {
  currentPage: number;
  totalPages: number;
  total?: number;
  offset: number;
  onPrevClick: () => void;
  onNextClick: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between border-t pt-4">
      <p className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
        {total ? (
          <span className="ml-1">({total.toLocaleString()} total)</span>
        ) : null}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevClick}
          disabled={offset === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextClick}
          disabled={!total || offset + PAGE_SIZE >= total}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function AdminBatchesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [offset, setOffset] = useState(0);

  const [debouncedSearch] = useDebounce(search, 300);

  const params = {
    status: status !== 'all' ? status : undefined,
    tenant_id: debouncedSearch || undefined,
    limit: PAGE_SIZE,
    offset,
  };

  const { data, isLoading, error } = useAdminBatches(params);
  const resumeStuck = useAdminResumeStuckBatches();

  const handleResumeStuck = async () => {
    try {
      await resumeStuck.mutateAsync();
      toast.success('Resume task queued for all stuck batches');
    } catch {
      toast.error('Failed to resume stuck batches');
    }
  };

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <div>
      <PageHeader
        total={data?.total}
        isPending={resumeStuck.isPending}
        onResumeStuck={handleResumeStuck}
      />

      <Card>
        <FilterControls
          search={search}
          status={status}
          onSearchChange={v => {
            setSearch(v);
            setOffset(0);
          }}
          onStatusChange={v => {
            setStatus(v);
            setOffset(0);
          }}
        />
        <CardContent className="pt-0">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState />
          ) : (data?.items?.length ?? 0) === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-2">
              {data?.items?.map(batch => (
                <BatchRow key={batch.id} batch={batch} />
              ))}
            </div>
          )}

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            total={data?.total}
            offset={offset}
            onPrevClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            onNextClick={() => setOffset(offset + PAGE_SIZE)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
