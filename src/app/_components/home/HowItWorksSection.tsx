'use client';

import { motion } from 'framer-motion';
import { Eraser, ImageDown, ScanText } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: ScanText,
      number: '01',
      title: 'Detect',
      description:
        'Google Vision AI scans every text region, detecting language automatically. Bounding boxes and confidence scores per word included for verification.',
    },
    {
      icon: Eraser,
      number: '02',
      title: 'Remove & Translate',
      description:
        'Text is cleanly removed and background reconstructed. Each region is translated by GPT-4o into your target language with native-speaker quality.',
    },
    {
      icon: ImageDown,
      number: '03',
      title: 'Render back',
      description:
        'Translated text is rendered in the exact same position with matching style and alignment. Download a finished image — not a transcript.',
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
            The process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="from-foreground to-foreground/70 mb-5 bg-linear-to-r bg-clip-text text-4xl leading-tight font-bold tracking-tight text-transparent md:text-5xl"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed"
          >
            Three intelligent steps. One output you can actually use.
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
              transition: { staggerChildren: 0.12, delayChildren: 0.1 },
            },
          }}
          className="grid gap-8 md:grid-cols-3 lg:gap-12"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                  className="text-primary/60 mb-3 text-xs font-bold tracking-widest"
                >
                  {step.number}
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 20,
                    delay: 0.15 + index * 0.08,
                  }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 0 30px rgba(var(--primary), 0.3)',
                  }}
                  className="border-primary/30 from-primary/10 to-primary/5 group-hover:border-primary/60 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-linear-to-br transition-all duration-300 group-hover:shadow-lg"
                >
                  <Icon className="text-primary h-8 w-8" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                  className="mt-5 text-base font-semibold tracking-tight"
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 + index * 0.08 }}
                  className="text-muted-foreground mt-3 text-sm leading-relaxed"
                >
                  {step.description}
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
