'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { BatchDetailContent } from '../_components/BatchDetailContent';

export default function BatchDetailPage() {
  const { id: batchId } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/history">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Batch Details</h1>
          <p className="text-muted-foreground font-mono text-xs">{batchId}</p>
        </div>
      </div>

      <BatchDetailContent batchId={batchId} />
    </div>
  );
}
