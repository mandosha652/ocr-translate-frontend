'use client';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

import { OnboardingChecklist } from '@/components/features/dashboard/OnboardingChecklist';
import { WelcomeModal } from '@/components/features/onboarding/WelcomeModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useUsageStats } from '@/hooks';
import { formatLastActive } from '@/lib/utils/date';
import type { UsageStatsResponse } from '@/types';

import { AccountCard } from './_components/AccountCard';
import { QuickActionCards } from './_components/QuickActionCards';
import { StatsGrid } from './_components/StatsGrid';
import { TopLanguagesCard } from './_components/TopLanguagesCard';
import { WelcomeHeader } from './_components/WelcomeHeader';

function ErrorFallback() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex items-center justify-center gap-2 py-12">
        <AlertTriangle className="text-muted-foreground h-5 w-5" />
        <p className="text-muted-foreground">
          Something went wrong loading the dashboard.
        </p>
      </CardContent>
    </Card>
  );
}

function UsageErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="text-muted-foreground h-4 w-4 shrink-0" />
          <span className="text-muted-foreground">
            Could not load usage stats
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

function LastActiveCard({
  usage,
  isLoading,
}: {
  usage: UsageStatsResponse | undefined;
  isLoading: boolean;
}) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-center gap-1">
          <Clock className="text-muted-foreground h-3.5 w-3.5" />
          <p className="text-muted-foreground text-xs">Last Active</p>
        </div>
        <p className="mt-2 text-lg font-bold">
          {isLoading ? '—' : formatLastActive(usage?.last_activity ?? null)}
        </p>
        <p className="text-muted-foreground text-sm">most recent job</p>
      </CardContent>
    </Card>
  );
}

function DashboardInsights({
  usage,
  isLoading,
  isError,
  isNewUser,
  onRetry,
}: {
  usage: UsageStatsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  isNewUser: boolean;
  onRetry: () => void;
}) {
  const shouldShowLanguages =
    !isNewUser &&
    !isError &&
    (isLoading || (usage?.most_used_languages.length ?? 0) > 0);

  return (
    <>
      {isError ? <UsageErrorCard onRetry={onRetry} /> : null}

      {!isNewUser && !isError && (
        <LastActiveCard usage={usage} isLoading={isLoading} />
      )}

      {shouldShowLanguages ? (
        <TopLanguagesCard
          languages={usage?.most_used_languages ?? []}
          isLoading={isLoading}
        />
      ) : null}
    </>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: usage, isLoading, isError, refetch } = useUsageStats();

  const isNewUser =
    !isLoading && !isError && (usage?.all_time.translations_count ?? 0) === 0;

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="space-y-8">
        {!isLoading && user ? <WelcomeModal user={user} /> : null}

        <WelcomeHeader user={user} isNewUser={isNewUser} />

        {!isLoading && !isError && usage ? (
          <OnboardingChecklist usage={usage} />
        ) : null}

        <StatsGrid
          usage={usage}
          isLoading={isLoading}
          isError={isError}
          isNewUser={isNewUser}
        />

        <DashboardInsights
          usage={usage}
          isLoading={isLoading}
          isError={isError}
          isNewUser={isNewUser}
          onRetry={() => refetch()}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <QuickActionCards />
        </div>

        <AccountCard user={user} usage={usage} isLoading={isLoading} />
      </div>
    </ErrorBoundary>
  );
}
