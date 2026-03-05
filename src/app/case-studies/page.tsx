'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

import { HomeFooter } from '@/app/_components/home/HomeFooter';
import { HomeHeader } from '@/app/_components/home/HomeHeader';

export const metadata: Metadata = {
  title: 'Case Studies — ImgText',
  description:
    'See how leading companies use ImgText to scale image translation.',
};

interface CaseStudy {
  id: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  image: string;
  testimonial: {
    quote: string;
    author: string;
    title: string;
  };
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    company: 'Global Ecommerce Leader',
    industry: 'E-Commerce',
    challenge:
      'Translating 500+ product images across 8 markets. Previously took 40 hours/week in Photoshop + manual QA.',
    solution:
      'Implemented ImgText API for batch processing. Integrated with product pipeline to auto-translate images on new product launches.',
    results: [
      'Reduced translation time from 40h to 5h per week',
      'Launched in 8 new markets simultaneously',
      'Improved accuracy from 87% to 99%',
      'Zero manual post-processing needed',
    ],
    metrics: [
      { label: 'Time saved', value: '87.5%' },
      { label: 'Markets launched', value: '8' },
      { label: 'Accuracy rate', value: '99%' },
      { label: 'Cost reduction', value: '73%' },
    ],
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ecommerce',
    testimonial: {
      quote:
        'ImgText cut our go-to-market time in half. We can now launch globally in days instead of weeks.',
      author: 'Sarah Chen',
      title: 'VP Product',
    },
  },
  {
    id: '2',
    company: 'SaaS Documentation Platform',
    industry: 'Software',
    challenge:
      'Docs include 200+ screenshots. Keeping translations in sync with English docs was a bottleneck every release.',
    solution:
      'Built automated pipeline: screenshot changes trigger ImgText translation. Results versioned in Git alongside docs.',
    results: [
      'Docs now published in 5 languages on day-1 of release',
      'Eliminated 2-week localization lag',
      'Increased global adoption by 45&percnt;',
      'No more manual screenshot translation',
    ],
    metrics: [
      { label: 'Languages supported', value: '5' },
      { label: 'Localization time', value: '0h' },
      { label: 'Adoption increase', value: '+45%' },
      { label: 'Release cycles', value: 'Same-day' },
    ],
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=saas',
    testimonial: {
      quote:
        'Our European and APAC users now feel like first-class citizens. Documentation is instant.',
      author: 'Marcus Johnson',
      title: 'Head of Localization',
    },
  },
  {
    id: '3',
    company: 'Design Agency Network',
    industry: 'Creative',
    challenge:
      'Clients request image translations for social media, marketing materials. Each required manual design work.',
    solution:
      'Integrated ImgText into Figma workflow. Designers upload assets, get multi-language versions in seconds.',
    results: [
      'Project turnaround: 2 weeks → 1 day',
      'Client satisfaction increased 92%',
      'Design team freed up for high-value work',
      'New revenue stream: localization services',
    ],
    metrics: [
      { label: 'Turnaround time', value: '1 day' },
      { label: 'Satisfaction score', value: '+92%' },
      { label: 'Design time saved', value: '60h/mo' },
      { label: 'New revenue', value: '+$15k/mo' },
    ],
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
    testimonial: {
      quote:
        'We can now offer multi-language design services profitably. ImgText turned a cost center into revenue.',
      author: 'Elena Rodriguez',
      title: 'Studio Director',
    },
  },
];

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group border-primary/10 grid items-center gap-8 border-b py-16 last:border-b-0 md:grid-cols-2 md:gap-12 md:py-24 ${
        index % 2 === 1 ? 'md:[direction:rtl]' : ''
      }`}
    >
      {/* Image side */}
      <div className="relative">
        <div className="from-primary/20 to-primary/5 absolute inset-0 rounded-2xl bg-linear-to-br blur-3xl" />
        <Image
          src={study.image}
          alt={study.company}
          width={400}
          height={384}
          unoptimized
          className="border-primary/20 relative h-96 w-full rounded-2xl border object-cover"
        />
      </div>

      {/* Content side */}
      <div className="md:[direction:ltr]">
        <div className="bg-primary/10 border-primary/20 mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1">
          <span className="bg-primary h-2 w-2 rounded-full" />
          <span className="text-primary text-xs font-semibold tracking-wide uppercase">
            {study.industry}
          </span>
        </div>

        <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
          {study.company}
        </h2>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          <span className="text-foreground font-semibold">Challenge:</span>{' '}
          {study.challenge}
        </p>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          <span className="text-foreground font-semibold">Solution:</span>{' '}
          {study.solution}
        </p>

        {/* Metrics */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          {study.metrics.map(metric => (
            <div
              key={metric.label}
              className="bg-muted/50 border-primary/10 rounded-lg border p-4"
            >
              <p className="text-primary mb-1 text-2xl font-bold">
                {metric.value}
              </p>
              <p className="text-muted-foreground text-xs font-medium">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="mb-8 space-y-3">
          {study.results.map(result => (
            <div key={result} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20">
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>
              <p className="text-foreground text-sm">{result}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="border-primary/20 from-primary/5 to-primary/0 rounded-lg border bg-linear-to-br p-6">
          <p className="text-foreground mb-4 text-sm italic">
            &ldquo;{study.testimonial.quote}&rdquo;
          </p>
          <div>
            <p className="text-foreground text-sm font-semibold">
              {study.testimonial.author}
            </p>
            <p className="text-muted-foreground text-xs">
              {study.testimonial.title}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseStudiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b py-24 md:py-32">
          <div className="from-primary/5 via-background to-background absolute inset-0 -z-10 bg-linear-to-b" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto max-w-6xl px-4 text-center"
          >
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              From challenged teams to{' '}
              <span className="from-primary bg-linear-to-r via-purple-500 to-pink-500 bg-clip-text text-transparent">
                image translation leaders
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed">
              See how companies across industries use ImgText to save time,
              reduce costs, and scale globally.
            </p>
          </motion.div>
        </section>

        {/* Case studies */}
        <section className="container mx-auto max-w-6xl px-4 py-16">
          {CASE_STUDIES.map((study, index) => (
            <CaseStudyCard key={study.id} study={study} index={index} />
          ))}
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t py-24">
          <div className="from-primary/5 via-background to-background absolute inset-0 -z-10 bg-linear-to-t" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="container mx-auto max-w-4xl px-4 text-center"
          >
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Ready to transform your workflow?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              Join teams already using ImgText to scale image translation.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/signup"
                className="bg-primary text-primary-foreground hover:bg-primary/90 group inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-semibold transition-colors"
              >
                Start for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/pricing"
                className="border-primary/30 text-foreground hover:border-primary/50 hover:bg-primary/5 inline-flex items-center justify-center rounded-lg border px-8 py-4 font-semibold transition-colors"
              >
                View pricing
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
