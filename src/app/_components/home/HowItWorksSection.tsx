'use client';

import { Eraser, ImageDown, ScanText } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <p className="text-muted-foreground mt-3 text-center">
          Three steps. One output you can actually use.
        </p>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
              <ScanText className="text-primary h-7 w-7" />
            </div>
            <div className="text-primary/20 mt-2 text-4xl font-bold">01</div>
            <h3 className="mt-2 text-lg font-semibold">Detect</h3>
            <p className="text-muted-foreground mt-2">
              OCR scans every text region in the image, with bounding box
              coordinates and confidence scores per word.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
              <Eraser className="text-primary h-7 w-7" />
            </div>
            <div className="text-primary/20 mt-2 text-4xl font-bold">02</div>
            <h3 className="mt-2 text-lg font-semibold">
              Remove &amp; Translate
            </h3>
            <p className="text-muted-foreground mt-2">
              The original text is cleanly removed from the image. Then each
              region is translated into your target language.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
              <ImageDown className="text-primary h-7 w-7" />
            </div>
            <div className="text-primary/20 mt-2 text-4xl font-bold">03</div>
            <h3 className="mt-2 text-lg font-semibold">Render back</h3>
            <p className="text-muted-foreground mt-2">
              Translated text is rendered onto the image in the exact same
              position. Download a finished image — not a transcript.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
