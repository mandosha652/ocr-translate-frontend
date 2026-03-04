'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BatchStatusResponse, SingleTranslationRecord } from '@/types';

import { BatchHistoryTab } from './BatchHistoryTab';
import { SingleHistoryTab } from './SingleHistoryTab';

interface HistoryTabsContainerProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  singles: SingleTranslationRecord[];
  batches: BatchStatusResponse[];
  singlePage: number;
  batchPage: number;
  totalSinglePages: number;
  totalBatchPages: number;
  onSinglePageChange: (page: number) => void;
  onBatchPageChange: (page: number) => void;
  isSingleLoading: boolean;
  searchQuery: string;
  isBatchLoading: boolean;
}

export function HistoryTabsContainer({
  activeTab,
  onTabChange,
  singles,
  batches,
  singlePage,
  batchPage,
  totalSinglePages,
  totalBatchPages,
  onSinglePageChange,
  onBatchPageChange,
  isSingleLoading,
  searchQuery,
  isBatchLoading,
}: HistoryTabsContainerProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="single">Single Images</TabsTrigger>
        <TabsTrigger value="batch">Batches</TabsTrigger>
      </TabsList>

      <TabsContent value="single" className="mt-6">
        <SingleHistoryTab
          items={singles}
          page={singlePage}
          totalPages={totalSinglePages}
          isLoading={isSingleLoading}
          searchQuery={searchQuery}
          onPageChange={onSinglePageChange}
        />
      </TabsContent>

      <TabsContent value="batch" className="mt-6">
        <BatchHistoryTab
          batches={batches}
          page={batchPage}
          totalPages={totalBatchPages}
          onPageChange={onBatchPageChange}
          isLoading={isBatchLoading}
          searchQuery={searchQuery}
        />
      </TabsContent>
    </Tabs>
  );
}
