'use client';

import { HeroCTAActions } from '@/components/features/home/HomeActions';

export function HeroSection() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
      <div className="flex flex-col items-center text-center">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Translate image text.{' '}
          <span className="text-muted-foreground">Get a new image back.</span>
        </h1>
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg">
          Upload an image with text in it. We detect every word, remove the
          original, translate it, and render it back onto the image — in the
          same position. You get a ready-to-use image, not a text box.
        </p>
        <HeroCTAActions />
      </div>
    </section>
  );
}
