'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  value: number;
  label: string;
  suffix: string;
}

function AnimatedCounter({ value, label, suffix }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let current = 0;
    const increment = value / 60;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isVisible, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group border-border/50 bg-card hover:border-primary/50 relative flex flex-col items-center gap-2 rounded-2xl border px-4 py-8 shadow-sm transition-all duration-300 hover:shadow-lg md:px-6"
    >
      {/* Glow effect on hover */}
      <div className="from-primary/20 to-primary/0 absolute -inset-0.5 -z-10 rounded-2xl bg-linear-to-r opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-wrap items-baseline justify-center gap-1">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
          className="from-primary to-primary/70 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent tabular-nums md:text-5xl"
        >
          {displayValue.toLocaleString()}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-muted-foreground text-lg font-semibold md:text-xl"
        >
          {suffix}
        </motion.span>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground text-sm font-medium"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

export function TrustSection() {
  const stats = [
    { value: 1000000, label: 'Images Translated', suffix: '+' },
    { value: 27, label: 'Languages Supported', suffix: '' },
    { value: 99, label: 'Accuracy Rate', suffix: '%' },
    { value: 7, label: 'Processing Steps', suffix: '' },
  ];

  return (
    <section className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
        {/* Heading */}
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
            Trusted by teams worldwide
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="from-foreground to-foreground/70 mb-0 bg-linear-to-r bg-clip-text text-4xl leading-tight font-bold tracking-tight text-transparent md:text-5xl"
          >
            The ImgText Effect
          </motion.h2>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
          className="grid gap-6 md:grid-cols-2 md:gap-4 lg:grid-cols-4"
        >
          {stats.map(stat => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <AnimatedCounter
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6"
        >
          {[
            { icon: '✓', label: '99.9% Uptime SLA' },
            { icon: '✓', label: 'SOC 2 Type II Certified' },
            { icon: '✓', label: 'GDPR Compliant' },
          ].map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: 0.35 + idx * 0.08,
                type: 'spring',
              }}
              className="text-muted-foreground flex items-center gap-2 text-sm"
            >
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="font-medium">{badge.label}</span>
              {idx < 2 && <div className="bg-border/60 ml-2 h-4 w-px" />}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
