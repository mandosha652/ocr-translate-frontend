'use client';

import { motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

export function BeforeAfterSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };
  const handleTouchStart = () => setIsDragging(true);
  const handleTouchEnd = () => setIsDragging(false);
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <section className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0 },
            },
          }}
          className="mb-16 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              duration: 0.8,
            }}
            className="mb-6 inline-block"
          >
            <div className="from-primary/15 to-primary/5 border-primary/40 shadow-primary/10 rounded-full border bg-linear-to-r px-4 py-2.5 shadow-lg backdrop-blur-sm">
              <p className="text-primary flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                ✨ The transformation
              </p>
            </div>
          </motion.div>

          {/* Main heading with character-level animation */}
          <motion.div className="overflow-hidden">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
                type: 'spring',
                stiffness: 100,
                damping: 20,
              }}
              className="from-foreground via-foreground to-foreground/60 mb-6 bg-linear-to-r bg-clip-text text-5xl leading-tight font-bold tracking-tight text-transparent md:text-7xl"
            >
              See the magic in action
            </motion.h2>
          </motion.div>

          {/* Description with word-level animation */}
          <motion.div
            className="mx-auto max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.3 },
              },
            }}
          >
            <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
              {[
                'Drag the slider to see how ImgText',
                'transforms your images.',
                'Text detected, removed, translated,',
                'and rendered back —',
                'all in one seamless step.',
              ].map((phrase, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.35 + idx * 0.08,
                    ease: 'easeOut',
                  }}
                  className="mr-1 inline-block"
                >
                  {phrase}{' '}
                </motion.span>
              ))}
            </p>
          </motion.div>

          {/* Animated underline accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            className="from-primary to-primary/0 mx-auto mt-8 h-1 w-16 origin-left rounded-full bg-linear-to-r"
          />
        </motion.div>

        {/* Slider */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, scale: 0.92, y: 20 },
            visible: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.7, delay: 0.15, ease: 'easeOut' },
            },
          }}
        >
          <div className="mx-auto max-w-4xl">
            {/* Container */}
            <div
              ref={containerRef}
              className="border-border/60 bg-muted/40 group shadow-primary/10 hover:shadow-primary/20 relative aspect-video w-full cursor-col-resize touch-none overflow-hidden rounded-2xl border shadow-2xl transition-shadow duration-300 select-none"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
            >
              {/* Before Image (Left side - original) */}
              <motion.div
                className="via-slate-850 absolute inset-0 flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-800 to-slate-900"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Text showcase with animation */}
                <motion.div
                  className="absolute inset-0 flex items-center p-8"
                  style={{ justifyContent: 'center', paddingRight: '50%' }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="w-full max-w-xs space-y-4">
                    <div className="space-y-2">
                      <motion.div
                        className="h-8 w-3/4 rounded bg-slate-400"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                      />
                      <motion.div
                        className="h-4 w-full rounded bg-slate-500"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      />
                      <motion.div
                        className="h-4 w-5/6 rounded bg-slate-500"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                      />
                    </div>
                    <motion.div
                      className="my-4 h-px bg-slate-600"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    />
                    <div className="space-y-2">
                      <motion.div
                        className="flex h-6 w-2/3 items-center justify-center rounded bg-blue-600 text-sm font-bold text-white"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: 'spring',
                          stiffness: 100,
                          damping: 15,
                          delay: 0.55,
                        }}
                      >
                        Read in German
                      </motion.div>
                      <motion.div
                        className="h-4 w-full rounded bg-slate-600"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* "Before" label with pulse */}
                <motion.div
                  className="absolute top-4 left-4 rounded-full border border-slate-700/40 bg-slate-900/90 px-3 py-1 text-xs font-semibold text-slate-100 backdrop-blur-sm"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Original
                </motion.div>
              </motion.div>

              {/* After Image (Right side - clipped from left) */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center overflow-hidden bg-linear-to-br from-emerald-900 via-emerald-950 to-slate-900"
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Translated text showcase */}
                <motion.div
                  className="absolute inset-0 flex items-center p-8"
                  style={{ justifyContent: 'center', paddingLeft: '50%' }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="w-full max-w-xs space-y-4">
                    <div className="space-y-2">
                      <motion.div
                        className="h-8 w-3/4 rounded bg-emerald-300"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                      />
                      <motion.div
                        className="h-4 w-full rounded bg-emerald-400"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      />
                      <motion.div
                        className="h-4 w-5/6 rounded bg-emerald-400"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                      />
                    </div>
                    <motion.div
                      className="my-4 h-px bg-emerald-700"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    />
                    <div className="space-y-2">
                      <motion.div
                        className="flex h-6 w-2/3 items-center justify-center rounded bg-green-600 text-sm font-bold text-white"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: 'spring',
                          stiffness: 100,
                          damping: 15,
                          delay: 0.55,
                        }}
                      >
                        Auf Englisch lesen
                      </motion.div>
                      <motion.div
                        className="h-4 w-full rounded bg-emerald-600"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* "After" label with pulse */}
                <motion.div
                  className="absolute top-4 right-4 rounded-full border border-slate-700/40 bg-slate-900/90 px-3 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-sm"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Translated
                </motion.div>
              </motion.div>

              {/* Slider handle */}
              <motion.div
                className="bg-primary group/handle absolute top-0 bottom-0 z-10 w-0.5 transition-shadow duration-200"
                style={{ left: `${sliderPosition}%` }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Glow effect */}
                <motion.div
                  className="bg-primary/0 absolute top-0 -right-3 bottom-0 -left-3 blur-xl"
                  animate={{ opacity: isDragging ? 0.4 : 0.1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Main handle button */}
                <motion.div
                  className="border-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-slate-950 p-4 shadow-2xl backdrop-blur-sm"
                  animate={{
                    scale: isDragging ? 1.2 : 1,
                    boxShadow: isDragging
                      ? '0 0 30px rgba(var(--primary), 0.6), 0 20px 40px rgba(0, 0, 0, 0.3)'
                      : '0 20px 40px rgba(0, 0, 0, 0.2)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <motion.div
                    className="flex gap-1"
                    animate={{ opacity: isDragging ? 1 : 0.7 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="bg-primary h-5 w-1 rounded-full"
                      animate={{ y: isDragging ? -2 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="bg-primary/80 h-5 w-1 rounded-full"
                      animate={{ y: isDragging ? 0 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="bg-primary/60 h-5 w-1 rounded-full"
                      animate={{ y: isDragging ? 2 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </motion.div>

                {/* Tooltip hint */}
                <motion.div
                  className="border-primary/50 text-primary pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 rounded-md border bg-slate-950 px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isDragging ? 1 : 0,
                    y: isDragging ? 0 : 10,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Drag to compare
                </motion.div>
              </motion.div>
            </div>

            {/* Helper text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground mt-6 text-center text-sm font-medium"
            >
              <span className="inline-flex items-center gap-1">
                👆 Drag to compare •
              </span>
              <span className="text-primary font-semibold">
                {' '}
                Original on left
              </span>
              <span>,</span>
              <span className="text-primary font-semibold">
                {' '}
                Translated on right
              </span>
            </motion.p>
          </div>
        </motion.div>

        {/* Stats below */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 0.2 },
            },
          }}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {[
            { value: '0.5s', label: 'OCR Detection', icon: '👁️' },
            { value: '2.1s', label: 'Remove & Translate', icon: '⚡' },
            { value: '1.2s', label: 'Rendering', icon: '✨' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              <div className="from-primary/20 to-primary/0 absolute -inset-0.5 rounded-xl bg-linear-to-r opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
              <div className="border-border/50 from-muted/80 to-muted/40 hover:border-primary/50 relative rounded-xl border bg-linear-to-br px-6 py-8 backdrop-blur-sm transition-colors duration-300">
                <div className="mb-3 text-3xl">{stat.icon}</div>
                <p className="from-primary to-primary/70 mb-3 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent tabular-nums md:text-5xl">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
