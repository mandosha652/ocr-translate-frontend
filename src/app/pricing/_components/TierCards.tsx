'use client';

import { motion } from 'framer-motion';

interface Tier {
  id: string;
  name: string;
  description: string;
  price?: string;
  billingPeriod?: string;
  cta?: string;
}

interface TierCardsProps {
  tiers: Tier[];
}

export function TierCards({ tiers }: TierCardsProps) {
  return (
    <div className="mb-16 grid gap-6 md:grid-cols-4">
      {tiers.map((tier, index) => {
        const isPopular = tier.id === 'business';

        return (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative rounded-2xl border transition-all duration-300 ${
              isPopular
                ? 'border-primary/50 from-primary/10 via-card to-card ring-primary/20 scale-105 bg-linear-to-br shadow-xl ring-1'
                : 'border-primary/10 bg-card hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg'
            }`}
          >
            {/* Popular badge */}
            {isPopular ? (
              <div className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold">
                Most popular
              </div>
            ) : null}

            <div className="flex h-full flex-col p-8">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-foreground text-2xl font-bold">
                  {tier.name}
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              {tier.price ? (
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-foreground text-4xl font-bold">
                      {tier.price}
                    </span>
                    {tier.billingPeriod ? (
                      <span className="text-muted-foreground text-sm">
                        {tier.billingPeriod}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* CTA */}
              {tier.cta ? (
                <button
                  className={`mb-8 w-full rounded-lg py-3 font-semibold transition-all duration-300 ${
                    isPopular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border-primary/30 text-foreground hover:border-primary/50 hover:bg-primary/5 border'
                  }`}
                >
                  {tier.cta}
                </button>
              ) : null}

              {/* Features */}
              <div className="flex-1 space-y-3">
                <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wide uppercase">
                  What&apos;s included
                </p>
                {/* Features will be populated by parent component */}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
