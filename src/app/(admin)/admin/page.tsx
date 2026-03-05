'use client';

import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Layers,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAdminStats } from '@/hooks';

import { AdminPageHeader } from './_components/AdminPageHeader';
import { BrokerHealthCard } from './_components/broker-health-card';
import { CleanupSection } from './_components/cleanup-section';
import { CostSection } from './_components/cost-section';
import { type CostPeriod, CostPeriodTabs } from './_components/CostPeriodTabs';
import { DailyCostChart } from './_components/daily-cost-chart';
import { ServiceHealthSection } from './_components/service-health-section';
import { SectionHeader, StatCard } from './_components/stat-card';

function StatsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="bg-muted h-[72px] animate-pulse rounded-xl" />
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <div>
        <div className="bg-muted mb-1 h-8 w-48 animate-pulse rounded" />
        <div className="bg-muted h-4 w-64 animate-pulse rounded" />
      </div>
      <StatsSkeleton />
      <StatsSkeleton />
      <StatsSkeleton />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3">
      <div className="bg-destructive/10 rounded-full p-3">
        <AlertTriangle className="text-destructive h-6 w-6" />
      </div>
      <p className="font-semibold">Failed to load stats</p>
      <p className="text-muted-foreground text-sm">
        Check your admin key and try again
      </p>
    </div>
  );
}

function TierBreakdownCard({
  stats,
}: {
  stats: ReturnType<typeof useAdminStats>['data'];
}) {
  if (!stats) return null;
  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4 py-4">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Tier Breakdown
        </p>
        <div className="mt-3 space-y-1.5">
          {[
            {
              label: 'Free',
              tier: 'free',
              count: stats.users_by_tier.free,
              cls: '',
            },
            {
              label: 'Pro',
              tier: 'pro',
              count: stats.users_by_tier.pro,
              cls: 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
            },
            {
              label: 'Enterprise',
              tier: 'enterprise',
              count: stats.users_by_tier.enterprise,
              cls: 'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
            },
          ].map(({ label, tier, count, cls }) => (
            <div key={tier} className="flex items-center justify-between">
              <Badge variant="outline" className={`text-xs ${cls}`}>
                {label}
              </Badge>
              <span className="text-sm font-semibold tabular-nums">
                {count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ApiCallsCard({
  stats,
}: {
  stats: ReturnType<typeof useAdminStats>['data'];
}) {
  if (!stats) return null;
  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4 py-4">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          API Calls Today
        </p>
        <div className="mt-3 space-y-1.5">
          {[
            { label: 'OCR', value: stats.ocr_calls_today },
            { label: 'Translate', value: stats.translate_calls_today },
            { label: 'Inpaint', value: stats.inpaint_calls_today },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold tabular-nums">
                {value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewPage() {
  const { data: stats, isLoading, error } = useAdminStats();
  const [costPeriod, setCostPeriod] = useState<CostPeriod>('month');

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!stats) return null;

  return (
    <div>
      <AdminPageHeader />

      <SectionHeader title="Users" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats.total_users} icon={Users} />
        <StatCard
          label="Active Users"
          value={stats.active_users}
          sub={`${stats.verified_users} verified`}
          icon={CheckCircle}
        />
        <StatCard
          label="New Today"
          value={stats.new_users_today}
          sub={`${stats.new_users_this_month} this month`}
          icon={TrendingUp}
          highlight={stats.new_users_today > 0}
        />
        <TierBreakdownCard stats={stats} />
      </div>

      <SectionHeader title="Batches" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Batches"
          value={stats.total_batches}
          icon={Layers}
        />
        <StatCard
          label="Today"
          value={stats.batches_today}
          icon={Activity}
          highlight={stats.batches_today > 0}
        />
        <StatCard
          label="Pending / Processing"
          value={stats.pending_batches}
          sub={`${stats.processing_batches} processing`}
          icon={Clock}
          highlight={stats.pending_batches > 10}
        />
        <StatCard
          label="Failed Today"
          value={stats.failed_batches_today}
          icon={AlertTriangle}
          highlight={stats.failed_batches_today > 0}
        />
      </div>

      <SectionHeader title="Usage" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Images Processed"
          value={stats.total_images_processed}
          sub={`${stats.images_processed_today} today`}
          icon={ImageIcon}
        />
        <StatCard
          label="Total Translations"
          value={stats.total_translations}
          sub={`${stats.translations_today} today`}
          icon={TrendingUp}
        />
        <StatCard
          label="OCR Calls Today"
          value={stats.ocr_calls_today}
          icon={Activity}
        />
        <ApiCallsCard stats={stats} />
      </div>

      <CostPeriodTabs
        period={costPeriod as CostPeriod}
        onPeriodChange={setCostPeriod}
      />
      <CostSection period={costPeriod} />
      <DailyCostChart />

      <SectionHeader title="System" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceHealthSection />
        <BrokerHealthCard />
        <CleanupSection />
      </div>
    </div>
  );
}
