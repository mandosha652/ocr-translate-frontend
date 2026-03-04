'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  totalUsers?: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function UserPagination({
  currentPage,
  totalPages,
  totalUsers,
  onPreviousPage,
  onNextPage,
}: UserPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between border-t pt-4">
      <p className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
        {totalUsers != null && (
          <span className="ml-1">({totalUsers.toLocaleString()} total)</span>
        )}
      </p>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
