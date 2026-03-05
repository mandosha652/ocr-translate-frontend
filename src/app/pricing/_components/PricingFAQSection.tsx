'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Can I switch plans anytime?',
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly.",
  },
  {
    question: 'What happens if I exceed my monthly limit?',
    answer:
      "During beta, limits are not enforced. When we launch fully, you'll be notified before hitting your limit, and you can upgrade to continue processing images.",
  },
  {
    question: 'Do you offer annual pricing?',
    answer:
      "Not yet, but it's on our roadmap. For now, you're billed monthly. Contact our team if you need a custom enterprise agreement.",
  },
  {
    question: 'Is there a free trial for Pro?',
    answer:
      "Our Free plan is your trial — no credit card required. You get 50 images/month to test everything. Upgrade whenever you're ready.",
  },
  {
    question: 'What if I need more than 100 images per batch?',
    answer:
      'For now, the limit is 100 images per batch. Contact our team for enterprise requirements — we can discuss custom solutions.',
  },
  {
    question: 'Do you offer discounts for non-profits?',
    answer:
      'We do! Non-profit organizations get 50% off Pro plans. Email support@imgtext.io with your 501(c)(3) documentation.',
  },
];

function FAQItem({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-primary/10 border-b last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-muted/30 group flex w-full items-start justify-between gap-4 px-0 py-5 text-left transition-colors"
      >
        <span className="text-foreground group-hover:text-primary font-semibold transition-colors">
          {item.question}
        </span>
        <ChevronDown
          className={`text-primary h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-muted-foreground pb-5 text-sm leading-relaxed">
            {item.answer}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export function PricingFAQSection() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto max-w-2xl px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about ImgText pricing and plans
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="border-primary/10 space-y-0 rounded-xl border p-6 md:p-8">
          {FAQS.map((item, index) => (
            <FAQItem key={item.question} item={item} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Still have questions? We&apos;re here to help.
          </p>
          <a
            href="mailto:support@imgtext.io"
            className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 inline-flex items-center justify-center rounded-lg border px-8 py-3 font-semibold transition-colors"
          >
            Email our team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
