'use client';

import { ArrowRight, Clock, Layers } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export function HistoryEmptyState() {
  return (
    <EmptyState
      icon={Clock}
      title="No translations yet"
      description="Your history will appear here after your first translation"
      size="lg"
      actions={
        <>
          <Link href="/translate">
            <Button size="sm">
              Single image <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/batch">
            <Button size="sm" variant="outline">
              Batch <Layers className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </>
      }
    />
  );
}
