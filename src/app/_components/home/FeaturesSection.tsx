'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  Eraser,
  Gift,
  ImageDown,
  Languages,
  Layers,
  Lock,
  ScanText,
  Zap,
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Layers,
      title: 'Batch processing',
      description:
        'Upload up to 100 images and translate to up to 10 languages in one job. Real-time progress with instant cancellation.',
    },
    {
      icon: Code2,
      title: 'Full API access',
      description:
        'Generate API keys with optional expiry, integration support, webhooks for async jobs, and per-key usage statistics.',
    },
    {
      icon: Languages,
      title: '27 languages',
      description:
        'English, German, French, Spanish, Italian, Portuguese, Dutch, Swedish, Danish, Norwegian, Finnish, Polish, Czech, Romanian, Hungarian, Ukrainian, Russian, Japanese, Chinese, Korean, Arabic, Turkish, Hebrew, Thai, Vietnamese, Hindi, Indonesian.',
    },
    {
      icon: Eraser,
      title: 'Exclude specific text',
      description:
        'Keep logos, brand names, handles, or any pattern untranslated. Your brand and identity stay intact across all translations.',
    },
    {
      icon: ScanText,
      title: 'OCR confidence scores',
      description:
        'Every detected text region includes confidence scores and bounding box coordinates. Know exactly where to verify results.',
    },
    {
      icon: ImageDown,
      title: 'Auto-detect source',
      description:
        "Don't know what language is in the image? Leave source on auto — Google Vision AI figures it out automatically.",
    },
    {
      icon: Zap,
      title: 'Logo & watermark removal',
      description:
        'Pro+ feature. Remove logos and watermarks from images before translation using advanced AI-powered removal technology.',
    },
    {
      icon: Lock,
      title: 'Enterprise security',
      description:
        'SOC 2 Type II certified, GDPR compliant, 99.9% uptime SLA, encrypted storage, and audit logs for compliance.',
    },
    {
      icon: Gift,
      title: 'Generous free tier',
      description:
        'Start free with 50 images/month. No credit card required. Upgrade only when you need more capacity.',
    },
  ];

  return (
    <section className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0 },
            },
          }}
          className="mb-14 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-primary mb-3 text-sm font-semibold tracking-widest uppercase"
          >
            Packed with power
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="from-foreground to-foreground/70 mb-5 bg-linear-to-r bg-clip-text text-4xl leading-tight font-bold tracking-tight text-transparent md:text-5xl"
          >
            Built for scale
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed"
          >
            Everything you need to translate images at any scale, from
            freelancers to enterprises
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.06, delayChildren: 0.1 },
            },
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group border-border/50 bg-card hover:border-primary/50 hover:shadow-primary/10 relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
              >
                {/* Glow background on hover */}
                <div className="from-primary/20 to-primary/0 absolute -inset-0.5 -z-10 rounded-2xl bg-linear-to-br opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                    className="mb-4 flex items-center gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className="from-primary/15 to-primary/5 group-hover:from-primary/25 group-hover:to-primary/10 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br transition-all duration-300"
                    >
                      <Icon className="text-primary h-5 w-5" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.15 + idx * 0.05 }}
                      className="text-foreground font-semibold"
                    >
                      {feature.title}
                    </motion.h3>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.05 }}
                    className="text-muted-foreground text-sm leading-relaxed"
                  >
                    {feature.description}
                  </motion.p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
