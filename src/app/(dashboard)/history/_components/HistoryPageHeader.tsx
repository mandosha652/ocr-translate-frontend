'use client';

import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface HistoryPageHeaderProps {
  onExportJSON: () => void;
  isEmpty: boolean;
  isLoading?: boolean;
}

export function HistoryPageHeader({
  onExportJSON,
  isEmpty,
}: HistoryPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">History</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          All your past translations
        </p>
      </div>
      {!isEmpty && (
        <Button variant="outline" size="sm" onClick={onExportJSON}>
          <Download className="mr-2 h-3.5 w-3.5" />
          Export JSON
        </Button>
      )}
    </div>
  );
}
