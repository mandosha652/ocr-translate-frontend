import { FeatureValue } from './FeatureValue';

interface TierFeature {
  label: string;
  free: string | boolean;
  pro: string | boolean;
  business: string | boolean;
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
    <div className="border-primary/10 from-primary/2 to-background mt-16 overflow-hidden rounded-2xl border bg-linear-to-b">
      <div className="border-primary/10 from-primary/5 to-primary/0 border-b bg-linear-to-r px-8 py-6 md:py-8">
        <h2 className="text-2xl font-bold md:text-3xl">
          Complete feature comparison
        </h2>
      </div>

      {/* Desktop table (md+) */}
      <div className="hidden md:block">
        <div className="border-primary/10 bg-muted/30 grid grid-cols-5 border-b px-8 py-4">
          <div className="text-muted-foreground text-sm font-semibold">
            Feature
          </div>
          {tiers.map(tier => (
            <div
              key={tier.id}
              className="text-foreground text-center text-sm font-semibold"
            >
              {tier.name}
            </div>
          ))}
        </div>

        {features.map((feature, i) => (
          <div
            key={feature.label}
            className={`hover:bg-primary/2 grid grid-cols-5 items-center px-8 py-5 transition-colors ${
              i < features.length - 1 ? 'border-primary/5 border-b' : ''
            }`}
          >
            <div className="text-foreground text-sm font-medium">
              {feature.label}
            </div>
            <div className="text-center">
              <FeatureValue value={feature.free} />
            </div>
            <div className="text-center">
              <FeatureValue value={feature.pro} />
            </div>
            <div className="text-center">
              <FeatureValue value={feature.business} />
            </div>
            <div className="text-center">
              <FeatureValue value={feature.enterprise} />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile stacked cards (below md) */}
      <div className="divide-primary/5 divide-y md:hidden">
        {features.map(feature => (
          <div
            key={feature.label}
            className="hover:bg-primary/2 px-6 py-5 transition-colors"
          >
            <p className="text-foreground mb-4 text-sm font-semibold">
              {feature.label}
            </p>
            <div className="grid grid-cols-4 gap-4">
              {tiers.map(tier => (
                <div key={tier.id} className="text-center">
                  <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
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
