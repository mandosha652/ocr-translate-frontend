'use client';

type CostPeriod = 'today' | 'week' | 'month' | 'alltime';

const PERIOD_LABELS: Record<CostPeriod, string> = {
  today: 'Today',
  week: 'Week',
  month: 'Month',
  alltime: 'All time',
};

interface CostPeriodTabsProps {
  period: CostPeriod;
  onPeriodChange: (p: CostPeriod) => void;
}

export function CostPeriodTabs({
  period,
  onPeriodChange,
}: CostPeriodTabsProps) {
  return (
    <div className="mt-8 mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
        Costs &amp; Profitability
      </h2>
      <div className="flex rounded-lg border p-0.5">
        {(Object.keys(PERIOD_LABELS) as CostPeriod[]).map(p => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`focus-visible:ring-ring/50 cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none sm:px-3 ${
              period === p
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { CostPeriod };
