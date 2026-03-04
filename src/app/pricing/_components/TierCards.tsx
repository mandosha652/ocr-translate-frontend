interface Tier {
  id: string;
  name: string;
  description: string;
}

interface TierCardsProps {
  tiers: Tier[];
}

export function TierCards({ tiers }: TierCardsProps) {
  return (
    <div className="mb-16 grid gap-6 md:grid-cols-3">
      {tiers.map(tier => (
        <div key={tier.id} className="bg-card rounded-xl border p-8">
          <h2 className="text-xl font-semibold">{tier.name}</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {tier.description}
          </p>
        </div>
      ))}
    </div>
  );
}
