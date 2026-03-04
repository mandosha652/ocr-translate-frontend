'use client';

import { ArrowRight, Layers, Users } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function AdminPageHeader() {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Live metrics across all tenants
        </p>
      </div>
      <div className="flex gap-2">
        <Link href="/admin/users">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Users
            <ArrowRight className="text-muted-foreground h-3 w-3" />
          </Button>
        </Link>
        <Link href="/admin/batches">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            Batches
            <ArrowRight className="text-muted-foreground h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
