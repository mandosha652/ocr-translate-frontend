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
  business: string | boolean;
  enterprise: string | boolean;
}

const FEATURES: TierFeature[] = [
  {
    label: 'Images per month',
    free: '20',
    pro: '500',
    business: '2,000',
    enterprise: 'Unlimited',
  },
  {
    label: 'Generative images per month',
    free: '5',
    pro: '50',
    business: '200',
    enterprise: 'Unlimited',
  },
  {
    label: 'Batch size',
    free: '5 images',
    pro: '25 images',
    business: '50 images',
    enterprise: '100 images',
  },
  {
    label: 'Target languages per batch',
    free: '2',
    pro: '5',
    business: 'All (26)',
    enterprise: 'All (26)',
  },
  {
    label: 'Concurrent batches',
    free: '1',
    pro: '3',
    business: '5',
    enterprise: '20',
  },
  {
    label: 'API keys',
    free: '2',
    pro: '10',
    business: '25',
    enterprise: '50',
  },
  {
    label: 'API access',
    free: true,
    pro: true,
    business: true,
    enterprise: true,
  },
  {
    label: 'Webhooks',
    free: false,
    pro: true,
    business: true,
    enterprise: true,
  },
  {
    label: 'Logo removal',
    free: false,
    pro: true,
    business: true,
    enterprise: true,
  },
  {
    label: 'Priority support',
    free: false,
    pro: true,
    business: true,
    enterprise: true,
  },
  {
    label: 'Custom integrations',
    free: false,
    pro: false,
    business: false,
    enterprise: true,
  },
  {
    label: 'Dedicated support',
    free: false,
    pro: false,
    business: true,
    enterprise: true,
  },
  {
    label: 'Custom SLA',
    free: false,
    pro: false,
    business: false,
    enterprise: true,
  },
  {
    label: 'File retention',
    free: '7 days',
    pro: '30 days',
    business: '90 days',
    enterprise: '365 days',
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
    description: 'For professionals and small teams',
    price: '$29',
    billingPeriod: '/month',
    cta: 'Start free trial',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For growing teams with high volume',
    price: '$99',
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
