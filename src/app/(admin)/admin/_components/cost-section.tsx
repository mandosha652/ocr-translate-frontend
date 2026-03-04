'use client';

import { DollarSign } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { useAdminCostByUser, useAdminCostSummary } from '@/hooks';

type CostPeriod = 'today' | 'week' | 'month' | 'alltime';

function fmtUSD(val: number | null | undefined): string {
  if (val == null) return '\u2014';
  return `$${val.toFixed(2)}`;
}

interface CostSectionProps {
  period: CostPeriod;
}

export function CostSection({ period }: CostSectionProps) {
  const { data: costSummary, isLoading: costLoading } =
    useAdminCostSummary(period);
  const { data: userCosts } = useAdminCostByUser(period);

  if (costLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted h-[72px] animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!costSummary) return null;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-0">
            <div className="flex items-stretch">
              <div className="flex w-12 shrink-0 items-center justify-center bg-emerald-500/10">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1 px-4 py-4">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Total Spend
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-600 tabular-nums">
                  {fmtUSD(costSummary.total_cost_usd)}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  all providers combined
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="px-4 py-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Google Vision
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {fmtUSD(costSummary.vision.cost_usd)}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {costSummary.vision.calls.toLocaleString()} OCR calls
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="px-4 py-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              OpenAI GPT-4o
            </p>
            {costSummary.openai.error ? (
              <p className="mt-1 text-sm text-orange-500">
                {costSummary.openai.error}
              </p>
            ) : (
              <p className="mt-1 text-2xl font-bold tabular-nums">
                {fmtUSD(costSummary.openai.cost_usd)}
              </p>
            )}
            <p className="text-muted-foreground mt-1 text-xs">
              via OpenAI billing API
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="px-4 py-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Replicate LaMa
            </p>
            {costSummary.replicate.error ? (
              <p className="mt-1 text-sm text-orange-500">
                {costSummary.replicate.error}
              </p>
            ) : (
              <p className="mt-1 text-2xl font-bold tabular-nums">
                {fmtUSD(costSummary.replicate.cost_usd)}
              </p>
            )}
            <p className="text-muted-foreground mt-1 text-xs">
              {costSummary.replicate.predictions} predictions
              {costSummary.replicate.total_seconds != null &&
                ` \u00b7 ${costSummary.replicate.total_seconds.toFixed(1)}s`}
            </p>
          </CardContent>
        </Card>
      </div>

      {userCosts && userCosts.length > 0 && (
        <Card className="mt-4">
          <CardContent className="pt-5 pb-4">
            <p className="mb-3 text-sm font-medium">
              Top Users by Vision Spend
            </p>
            <div className="space-y-2">
              {userCosts.slice(0, 5).map((row, i) => (
                <div
                  key={row.user_id}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="text-muted-foreground w-4 shrink-0 text-xs tabular-nums">
                    {i + 1}
                  </span>
                  <Link
                    href={`/admin/users/${row.user_id}`}
                    className="text-muted-foreground hover:text-foreground min-w-0 flex-1 truncate font-mono text-xs transition-colors"
                  >
                    {row.user_id}
                  </Link>
                  <span className="text-muted-foreground hidden shrink-0 text-xs sm:inline">
                    {row.images_processed.toLocaleString()} imgs
                  </span>
                  <span className="w-16 shrink-0 text-right font-semibold tabular-nums sm:w-20">
                    {fmtUSD(row.vision_cost_usd)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
