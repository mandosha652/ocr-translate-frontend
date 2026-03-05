'use client';

import { FeatureTable } from './_components/FeatureTable';
import { PricingFAQSection } from './_components/PricingFAQSection';
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
    pro: '2,000',
    enterprise: 'Unlimited',
  },
  {
    label: 'Batch size',
    free: '5 images',
    pro: '100 images',
    enterprise: '100 images',
  },
  { label: 'Target languages', free: '3', pro: '11', enterprise: '11' },
  { label: 'API access', free: true, pro: true, enterprise: true },
  { label: 'Webhooks', free: false, pro: true, enterprise: true },
  { label: 'Logo removal', free: false, pro: true, enterprise: true },
  { label: 'Priority support', free: false, pro: true, enterprise: true },
  { label: 'Custom integrations', free: false, pro: false, enterprise: true },
  { label: 'Dedicated support', free: false, pro: false, enterprise: true },
  { label: 'Custom SLA', free: false, pro: false, enterprise: true },
  {
    label: 'File retention',
    free: '7 days',
    pro: '30 days',
    enterprise: 'Never',
  },
];

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out ImgText',
    price: 'Free',
    cta: 'Get started',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and growing teams',
    price: '$29',
    billingPeriod: '/month',
    cta: 'Start free trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations with custom needs',
    price: 'Custom',
    cta: 'Contact sales',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <PricingHeader />
      <main className="mx-auto max-w-7xl px-4 py-16">
        <PricingHero />
        <TierCards tiers={TIERS} />
        <FeatureTable features={FEATURES} tiers={TIERS} />

        {/* Trust statement */}
        <div className="border-primary/10 from-primary/5 via-primary/2 to-primary/5 mt-16 rounded-xl border bg-linear-to-r p-8 text-center">
          <p className="text-muted-foreground">
            All plans include access to 11 European languages, image download,
            API key management, and our full documentation.
          </p>
        </div>

        <PricingFAQSection />
      </main>
      <PricingFooter />
    </div>
  );
}
