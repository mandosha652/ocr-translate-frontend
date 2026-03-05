'use client';

import { motion } from 'framer-motion';
import { Eraser, ImageDown, Zap } from 'lucide-react';

export function OutputsSection() {
  const outputs = [
    {
      icon: ImageDown,
      title: 'Translated Image',
      description:
        'The final output. Original image with translated text rendered back in position. Ready to publish, share, or print.',
    },
    {
      icon: Eraser,
      title: 'Text-Removed Image',
      description:
        'The image with all text erased and background reconstructed. Use as a clean base if you want to apply your own typography.',
    },
    {
      icon: Zap,
      title: 'Region Breakdown',
      description:
        'Every detected text region with original text, translation, position, and OCR confidence score — for validation or downstream automation.',
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
            Complete outputs
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="from-foreground to-foreground/70 mb-5 bg-linear-to-r bg-clip-text text-4xl leading-tight font-bold tracking-tight text-transparent md:text-5xl"
          >
            Three outputs per image
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed"
          >
            Every translation returns all three outputs — use whichever you need
            for your workflow
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
          className="grid gap-6 md:grid-cols-3"
        >
          {outputs.map((output, idx) => {
            const Icon = output.icon;
            return (
              <motion.div
                key={output.title}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group border-border/50 bg-card hover:border-primary/50 hover:shadow-primary/10 relative overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:shadow-lg"
              >
                {/* Glow effect */}
                <div className="from-primary/20 to-primary/0 absolute -inset-0.5 -z-10 rounded-2xl bg-linear-to-br opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: 'spring',
                      stiffness: 150,
                      damping: 20,
                      delay: 0.1 + idx * 0.08,
                    }}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="from-primary/15 to-primary/5 group-hover:from-primary/25 group-hover:to-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br transition-colors duration-300"
                  >
                    <Icon className="text-primary h-6 w-6" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 + idx * 0.08 }}
                    className="mb-3 text-lg font-semibold"
                  >
                    {output.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.08 }}
                    className="text-muted-foreground text-sm leading-relaxed"
                  >
                    {output.description}
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
