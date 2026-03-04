'use client';

import { XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import { getLangName } from '@/components/features/history/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslationHistory } from '@/hooks';
import { downloadHistoryJSON } from '@/lib/utils/blob';

import { BatchHistoryTab } from './_components/BatchHistoryTab';
import { HistoryEmptyState } from './_components/HistoryEmptyState';
import { HistoryPageHeader } from './_components/HistoryPageHeader';
import { HistorySearch } from './_components/HistorySearch';
import { SingleHistoryTab } from './_components/SingleHistoryTab';

const ITEMS_PER_PAGE = 20;

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const [batchPage, setBatchPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('single');

  const {
    data: singleHistory,
    isLoading: isSingleLoading,
    isError: isSingleError,
    refetch: refetchSingle,
  } = useTranslationHistory({
    limit: ITEMS_PER_PAGE,
    offset: (page - 1) * ITEMS_PER_PAGE,
  });

  const { data: batches, isLoading: isBatchesLoading } = useListBatches({
    enabled: true,
  });

  const finishedBatches = useMemo(
    () =>
      (batches ?? []).filter(
        b => b.status !== 'pending' && b.status !== 'processing'
      ),
    [batches]
  );

  const filteredSingles = useMemo(() => {
    const items = singleHistory?.items ?? [];
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      i =>
        getLangName(i.target_lang).toLowerCase().includes(q) ||
        (i.source_lang && getLangName(i.source_lang).toLowerCase().includes(q))
    );
  }, [singleHistory, searchQuery]);

  const filteredBatches = useMemo(() => {
    if (!searchQuery.trim()) return finishedBatches;
    const q = searchQuery.toLowerCase();
    return finishedBatches.filter(b =>
      b.target_languages.some(l => getLangName(l).toLowerCase().includes(q))
    );
  }, [finishedBatches, searchQuery]);

  const totalSinglePages = singleHistory
    ? Math.ceil(singleHistory.total / ITEMS_PER_PAGE)
    : 1;
  const totalBatchPages = Math.ceil(filteredBatches.length / ITEMS_PER_PAGE);
  const paginatedBatches = filteredBatches.slice(
    (batchPage - 1) * ITEMS_PER_PAGE,
    batchPage * ITEMS_PER_PAGE
  );
  const isLoading = isSingleLoading || isBatchesLoading;

  const handleExportJSON = () =>
    downloadHistoryJSON(singleHistory?.items ?? [], finishedBatches);

  const isEmpty =
    !isLoading &&
    !isSingleError &&
    (singleHistory?.items ?? []).length === 0 &&
    finishedBatches.length === 0;

  return (
    <div className="space-y-6">
      <HistoryPageHeader
        isEmpty={isEmpty}
        isLoading={isLoading}
        onExportJSON={handleExportJSON}
      />

      {isSingleError && (
        <div className="border-destructive/30 bg-destructive/5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
          <XCircle className="text-destructive h-4 w-4 shrink-0" />
          <span>Couldn&apos;t load your history — try refreshing</span>
          <button
            onClick={() => refetchSingle()}
            className="text-muted-foreground hover:text-foreground ml-auto cursor-pointer text-xs underline-offset-2 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {isEmpty && <HistoryEmptyState />}

      {!isEmpty && (
        <Tabs
          defaultValue="single"
          className="space-y-5"
          onValueChange={setActiveTab}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="single">
                Single
                {singleHistory && (
                  <span className="text-muted-foreground ml-1.5 text-xs">
                    ({singleHistory.total})
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="batch">
                Batch
                {finishedBatches.length > 0 && (
                  <span className="text-muted-foreground ml-1.5 text-xs">
                    ({finishedBatches.length})
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <HistorySearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="animate-in fade-in-0 duration-150" key={activeTab}>
            <TabsContent value="single" className="mt-0 space-y-3">
              <SingleHistoryTab
                items={filteredSingles}
                isLoading={isSingleLoading}
                searchQuery={searchQuery}
                page={page}
                totalPages={totalSinglePages}
                onPageChange={setPage}
              />
            </TabsContent>

            <TabsContent value="batch" className="mt-0 space-y-3">
              <BatchHistoryTab
                batches={paginatedBatches}
                isLoading={isBatchesLoading}
                searchQuery={searchQuery}
                page={batchPage}
                totalPages={totalBatchPages}
                onPageChange={setBatchPage}
              />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
}
