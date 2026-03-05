'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
  image: string;
  rating: number;
  useCase: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'ImgText cut our product image translation time from 2 hours to 5 minutes. We now launch in 8 languages simultaneously.',
    author: 'Sarah Chen',
    title: 'Product Manager',
    company: 'Ecommerce Leader',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    rating: 5,
    useCase: 'E-Commerce',
  },
  {
    quote:
      'The API integration was seamless. We batch-translate 500 product screenshots weekly without any manual work.',
    author: 'Marcus Johnson',
    title: 'Tech Lead',
    company: 'SaaS Platform',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    rating: 5,
    useCase: 'API Integration',
  },
  {
    quote:
      'Our design team loves it. No more Photoshop wrestling with text layers. One click, 10 languages done.',
    author: 'Elena Rodriguez',
    title: 'Design Director',
    company: 'Creative Studio',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
    rating: 5,
    useCase: 'Design Workflow',
  },
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group border-border/50 bg-card hover:border-primary/50 hover:shadow-primary/10 relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:shadow-lg"
    >
      {/* Glow effect */}
      <div className="from-primary/20 to-primary/0 absolute -inset-0.5 -z-10 rounded-2xl bg-linear-to-br opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10">
        {/* Rating */}
        <div className="mb-4 flex gap-1">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Quote */}
        <p className="text-foreground/90 mb-5 text-[15px] leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        {/* Divider */}
        <div className="from-primary/20 via-primary/10 my-6 h-px bg-gradient-to-r to-transparent" />

        {/* Author info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="border-border/50 h-10 w-10 shrink-0 overflow-hidden rounded-full border">
            <Image
              src={testimonial.image}
              alt={testimonial.author}
              width={40}
              height={40}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <p className="text-foreground text-sm font-semibold">
              {testimonial.author}
            </p>
            <p className="text-muted-foreground text-xs">{testimonial.title}</p>
            <p className="text-muted-foreground text-xs">
              {testimonial.company}
            </p>
          </div>

          {/* Use case badge */}
          <div className="bg-primary/10 border-primary/20 text-primary rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap">
            {testimonial.useCase}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
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
            Social proof
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="from-foreground to-foreground/70 mb-5 bg-linear-to-r bg-clip-text text-4xl leading-tight font-bold tracking-tight text-transparent md:text-5xl"
          >
            Loved by teams everywhere
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed"
          >
            See how ImgText is transforming how teams scale image translation
          </motion.p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Additional trust statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Trusted by leading companies for image translation at scale
          </p>
        </motion.div>
      </div>
    </section>
  );
}
