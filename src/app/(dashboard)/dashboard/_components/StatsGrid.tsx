'use client';

import {
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

import { UsageChart } from '@/components/features/dashboard/UsageChart';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { UsageStatsResponse } from '@/types';

function StatSkeleton() {
  return <div className="bg-muted h-9 w-16 animate-pulse rounded-md" />;
}

interface StatsGridProps {
  usage: UsageStatsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  isNewUser: boolean;
}

export function StatsGrid({
  usage,
  isLoading,
  isError,
  isNewUser,
}: StatsGridProps) {
  return (
    <div
      className={`grid gap-6 ${isNewUser ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'}`}
    >
      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Quick Translate
          </CardTitle>
          <CardDescription>
            Upload an image and get instant translation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/translate">
            <Button className="w-full gap-2">
              Start Translating <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Batch Translate
          </CardTitle>
          <CardDescription>
            Translate multiple images across languages at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/batch">
            <Button variant="outline" className="w-full gap-2">
              Open Batch <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {!isNewUser && !isLoading && !isError && usage && (
        <UsageChart usage={usage} />
      )}

      {!isNewUser && (isLoading || isError) && (
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            {isLoading ? (
              <StatSkeleton />
            ) : (
              <CardTitle className="text-muted-foreground text-3xl">
                —
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">images processed</p>
          </CardContent>
        </Card>
      )}

      {!isNewUser && (
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> All Time
            </CardDescription>
            {isLoading ? (
              <StatSkeleton />
            ) : isError ? (
              <CardTitle className="text-muted-foreground text-3xl">
                —
              </CardTitle>
            ) : (
              <CardTitle className="text-3xl">
                {usage?.all_time.translations_count ?? 0}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">total translations</p>
            {!isLoading &&
              !isError &&
              (usage?.all_time.images_processed ?? 0) > 0 && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {usage?.all_time.images_processed} images,{' '}
                  {usage?.all_time.batches_run} batches
                </p>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
