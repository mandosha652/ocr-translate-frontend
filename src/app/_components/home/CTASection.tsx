'use client';

import { BottomCTAAction } from '@/components/features/home/HomeActions';

export function CTASection() {
  return (
    <section className="bg-muted/50 border-t">
      <div className="container mx-auto max-w-6xl px-4 py-24">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold">
            Upload an image. Get a translated image.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl">
            No boxes, no transcripts, no copy-pasting. Your image — with the
            text translated in place.
          </p>
          <BottomCTAAction />
        </div>
      </div>
    </section>
  );
}
