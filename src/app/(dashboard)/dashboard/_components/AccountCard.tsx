'use client';

import { Layers } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { UsageStatsResponse, User } from '@/types';

interface AccountCardProps {
  user: User | null | undefined;
  usage: UsageStatsResponse | undefined;
  isLoading: boolean;
}

export function AccountCard({ user, usage, isLoading }: AccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground text-sm">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Plan</p>
            <p className="font-medium capitalize">{user?.tier || 'Free'}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Batches run</p>
            <p className="font-medium">
              {isLoading ? '—' : (usage?.all_time.batches_run ?? 0)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/settings">
            <Button variant="outline">Manage Account</Button>
          </Link>
          <Link href="/history">
            <Button variant="outline" className="gap-2">
              <Layers className="h-4 w-4" /> View History
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
