'use client';

import { motion } from 'framer-motion';

import { HeroCTAActions } from '@/components/features/home/HomeActions';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="from-primary/5 via-background to-background absolute inset-0 -z-10 bg-linear-to-b" />
      <motion.div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="container mx-auto max-w-6xl px-4 py-36 md:py-52">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0 },
            },
          }}
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              duration: 0.7,
            }}
            className="border-border/60 bg-muted/60 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
          >
            <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
            <span className="text-foreground/70">
              AI-powered OCR + Translation
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
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
              className="max-w-4xl text-5xl leading-[1.08] font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
            >
              <span className="text-foreground">Translate image text</span>
              <br />
              <span className="from-primary bg-linear-to-r via-purple-500 to-pink-500 bg-clip-text text-transparent">
                in seconds.
              </span>
            </motion.h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed md:text-xl"
          >
            Upload an image. We detect the text, remove it, translate it, and
            render it back onto your image — in the exact same position. You get
            a finished image, not a transcript.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="divide-border/50 mt-10 flex items-center justify-center divide-x"
          >
            {[
              { value: '27', label: 'Languages' },
              { value: '99%+', label: 'Accuracy' },
              { value: '<10s', label: 'Per image' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.35 + idx * 0.1,
                  type: 'spring',
                }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center px-8"
              >
                <p className="from-primary to-primary/70 bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent tabular-nums">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs font-medium tracking-wide uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10"
          >
            <HeroCTAActions />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
