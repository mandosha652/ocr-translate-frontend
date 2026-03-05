'use client';

import { motion } from 'framer-motion';

import { BottomCTAAction } from '@/components/features/home/HomeActions';

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t">
      {/* Gradient background */}
      <div className="from-primary/5 via-background to-background absolute inset-0 -z-10 bg-linear-to-t" />
      <motion.div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="container mx-auto max-w-6xl px-4 py-28 md:py-40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0 },
            },
          }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
                type: 'spring',
                stiffness: 80,
                damping: 20,
              }}
              className="max-w-2xl text-4xl leading-[1.08] font-extrabold tracking-tight md:text-5xl"
            >
              <span className="text-foreground">Upload an image.</span>
              <br />
              <span className="from-primary bg-linear-to-r via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Get a translated image.
              </span>
            </motion.h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-muted-foreground mt-5 max-w-lg text-lg leading-relaxed"
          >
            No boxes, no transcripts, no copy-pasting. Your image — with the
            text translated in place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10"
          >
            <BottomCTAAction />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
