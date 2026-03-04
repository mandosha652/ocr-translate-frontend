'use client';

import { FeatureTable } from './_components/FeatureTable';
import { PricingFooter } from './_components/PricingFooter';
import { PricingHeader } from './_components/PricingHeader';
import { PricingHero } from './_components/PricingHero';
import { TierCards } from './_components/TierCards';

interface TierFeature {
  label: string;
  free: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

const FEATURES: TierFeature[] = [
  {
    label: 'Images per month',
    free: '50',
    pro: '500',
    enterprise: 'Unlimited',
  },
  {
    label: 'Max batch size',
    free: '5 images',
    pro: '20 images',
    enterprise: '20 images',
  },
  { label: 'Target languages', free: '3', pro: '11', enterprise: '11' },
  { label: 'API access', free: true, pro: true, enterprise: true },
  { label: 'Priority processing', free: false, pro: true, enterprise: true },
  { label: 'Webhook notifications', free: false, pro: true, enterprise: true },
  { label: 'Dedicated support', free: false, pro: false, enterprise: true },
  { label: 'Custom SLA', free: false, pro: false, enterprise: true },
];

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Great for individuals and small projects',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and growing teams',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <PricingHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <PricingHero />
        <TierCards tiers={TIERS} />
        <FeatureTable features={FEATURES} tiers={TIERS} />
        <p className="text-muted-foreground mt-12 text-center text-sm">
          All plans include access to 11 European languages, image download, and
          API key management.
        </p>
      </main>
      <PricingFooter />
    </div>
  );
}
