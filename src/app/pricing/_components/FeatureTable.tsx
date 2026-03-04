import { FeatureValue } from './FeatureValue';

interface TierFeature {
  label: string;
  free: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

interface Tier {
  id: string;
  name: string;
}

interface FeatureTableProps {
  features: TierFeature[];
  tiers: Tier[];
}

export function FeatureTable({ features, tiers }: FeatureTableProps) {
  return (
    <div className="rounded-xl border">
      <div className="border-b px-6 py-4">
        <h2 className="font-semibold">What&apos;s included</h2>
      </div>

      {/* Desktop table (md+) */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 border-b px-6 py-3">
          <div className="text-muted-foreground text-sm font-medium">
            Feature
          </div>
          {tiers.map(tier => (
            <div key={tier.id} className="text-center text-sm font-semibold">
              {tier.name}
            </div>
          ))}
        </div>

        {features.map((feature, i) => (
          <div
            key={feature.label}
            className={`grid grid-cols-4 px-6 py-4 ${i < features.length - 1 ? 'border-b' : ''}`}
          >
            <div className="text-sm">{feature.label}</div>
            <div className="text-center">
              <FeatureValue value={feature.free} />
            </div>
            <div className="text-center">
              <FeatureValue value={feature.pro} />
            </div>
            <div className="text-center">
              <FeatureValue value={feature.enterprise} />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile stacked cards (below md) */}
      <div className="divide-y md:hidden">
        {features.map(feature => (
          <div key={feature.label} className="px-4 py-4">
            <p className="mb-3 text-sm font-medium">{feature.label}</p>
            <div className="grid grid-cols-3 gap-2">
              {tiers.map(tier => (
                <div key={tier.id} className="text-center">
                  <p className="text-muted-foreground mb-1 text-xs font-medium">
                    {tier.name}
                  </p>
                  <FeatureValue
                    value={
                      feature[tier.id as keyof typeof feature] as
                        | string
                        | boolean
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
