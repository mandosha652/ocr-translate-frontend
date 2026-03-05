import type { Metadata } from 'next';

import {
  APIShowcaseSection,
  BeforeAfterSection,
  ComparisonSection,
  CTASection,
  FeaturesSection,
  HeroSection,
  HomeFooter,
  HomeHeader,
  HowItWorksSection,
  OutputsSection,
  TestimonialsSection,
  TrustSection,
} from './_components/home';

export const metadata: Metadata = {
  title: 'ImgText — AI-Powered Image Translation',
  description:
    'Translate text in images instantly using AI-powered OCR and translation. Upload an image, get a translated image back — text rendered in the same position. Supports 11 European languages.',
  openGraph: {
    title: 'ImgText — AI-Powered Image Translation',
    description:
      'Upload an image with text, get a translated image back. AI-powered OCR removes the original text and renders the translation in place. Supports 11 European languages.',
    url: '/',
  },
  twitter: {
    title: 'ImgText — AI-Powered Image Translation',
    description:
      'Upload an image with text, get a translated image back. AI-powered OCR + translation in one step.',
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader />
      <main className="flex-1">
        <HeroSection />
        <TrustSection />
        <BeforeAfterSection />
        <HowItWorksSection />
        <ComparisonSection />
        <FeaturesSection />
        <TestimonialsSection />
        <APIShowcaseSection />
        <OutputsSection />
        <CTASection />
      </main>
      <HomeFooter />
    </div>
  );
}
