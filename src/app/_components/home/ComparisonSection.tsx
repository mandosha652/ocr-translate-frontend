'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const GRADIENT =
  'linear-gradient(135deg, oklch(0.45 0.22 260), oklch(0.55 0.20 300))';

interface ComparisonRow {
  feature: string;
  manual: string | boolean;
  plugin: string | boolean;
  imgtext: string | boolean;
}

const COMPARISONS: ComparisonRow[] = [
  {
    feature: 'Time per image',
    manual: '10-15 min',
    plugin: '2-3 min',
    imgtext: '< 10 sec',
  },
  {
    feature: 'Requires software',
    manual: 'Photoshop ($20/mo)',
    plugin: 'Figma ($49/mo)',
    imgtext: 'None',
  },
  {
    feature: 'Learning curve',
    manual: 'High',
    plugin: 'Medium',
    imgtext: 'None',
  },
  {
    feature: 'Batch processing',
    manual: false,
    plugin: false,
    imgtext: true,
  },
  {
    feature: 'API access',
    manual: false,
    plugin: false,
    imgtext: true,
  },
  {
    feature: 'Multi-language support',
    manual: 'Limited',
    plugin: 'Limited',
    imgtext: '11 languages',
  },
  {
    feature: 'Accuracy',
    manual: 'Manual (~95%)',
    plugin: '~80%',
    imgtext: '99%+',
  },
  {
    feature: 'Scalability',
    manual: 'None',
    plugin: 'Limited',
    imgtext: 'Unlimited',
  },
  {
    feature: 'Ready-to-use output',
    manual: true,
    plugin: false,
    imgtext: true,
  },
];

function ComparisonCell({
  value,
  highlight,
}: {
  value: string | boolean;
  highlight?: boolean;
}) {
  if (typeof value === 'boolean') {
    return (
      <td
        className={`px-6 py-4 text-center ${highlight ? 'bg-primary/8' : ''}`}
      >
        {value ? (
          <Check className="mx-auto h-5 w-5 font-bold text-green-500" />
        ) : (
          <X className="text-muted-foreground/50 mx-auto h-5 w-5" />
        )}
      </td>
    );
  }

  return (
    <td
      className={`px-6 py-4 text-center text-sm ${
        highlight
          ? 'bg-primary/8 text-primary font-semibold'
          : 'text-muted-foreground'
      }`}
    >
      {value}
    </td>
  );
}

export function ComparisonSection() {
  return (
    <section className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-primary mb-3 text-sm font-semibold tracking-widest uppercase">
            The comparison
          </p>
          <h2 className="mb-5 text-4xl leading-tight font-bold tracking-tight md:text-5xl">
            Why ImgText wins
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            See how we compare to manual editing, plugin-based tools, and other
            solutions
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="border-border/50 overflow-x-auto rounded-2xl border"
        >
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-border/50 bg-muted/40 border-b">
                <th className="text-foreground px-6 py-4 text-left text-sm font-semibold">
                  Feature
                </th>
                <th className="text-muted-foreground px-6 py-4 text-center text-sm font-semibold">
                  Manual Editing
                </th>
                <th className="text-muted-foreground px-6 py-4 text-center text-sm font-semibold">
                  Figma Plugin
                </th>
                <th className="text-primary bg-primary/8 px-6 py-5 text-center text-sm font-semibold">
                  ImgText
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {COMPARISONS.map((row, index) => (
                <tr
                  key={row.feature}
                  className={`border-border/30 hover:bg-muted/30 border-b transition-colors ${
                    index === COMPARISONS.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="text-foreground bg-background sticky left-0 px-6 py-4 text-sm font-medium">
                    {row.feature}
                  </td>
                  <ComparisonCell value={row.manual} />
                  <ComparisonCell value={row.plugin} />
                  <ComparisonCell value={row.imgtext} highlight />
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Ready to join teams already using ImgText?
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
            style={{ background: GRADIENT }}
          >
            Get started for free
          </a>
        </motion.div>
      </div>
    </section>
  );
}
