import { useMemo, useState } from 'react';

import { getLangName } from '@/components/features/history/utils';
import { useListBatches, useTranslationHistory } from '@/hooks';
import { downloadHistoryJSON } from '@/lib/utils/blob';

const ITEMS_PER_PAGE = 20;

export function useHistoryPage() {
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
    (singleHistory?.items?.length ?? 0) === 0 &&
    finishedBatches.length === 0;

  return {
    page,
    setPage,
    batchPage,
    setBatchPage,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    singleHistory,
    isSingleLoading,
    isSingleError,
    refetchSingle,
    filteredSingles,
    filteredBatches,
    paginatedBatches,
    totalSinglePages,
    totalBatchPages,
    isLoading,
    isEmpty,
    handleExportJSON,
  };
}
