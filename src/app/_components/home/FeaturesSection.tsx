'use client';

import {
  Code2,
  Eraser,
  ImageDown,
  Languages,
  Layers,
  ScanText,
} from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-center text-3xl font-bold">Built for scale</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="text-primary h-5 w-5" />
              <h3 className="font-semibold">Batch processing</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Upload up to 20 images and translate to up to 10 languages in one
              job. Real-time progress, cancel any time.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code2 className="text-primary h-5 w-5" />
              <h3 className="font-semibold">Full API access</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Generate API keys and integrate image translation directly into
              your pipeline. Webhooks supported for async batch jobs.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Languages className="text-primary h-5 w-5" />
              <h3 className="font-semibold">11 European languages</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              English, German, French, Spanish, Italian, Portuguese, Dutch,
              Swedish, Danish, Norwegian, Finnish.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eraser className="text-primary h-5 w-5" />
              <h3 className="font-semibold">Exclude specific text</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Keep logos, brand names, handles, or any pattern untranslated.
              Your brand stays intact.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ScanText className="text-primary h-5 w-5" />
              <h3 className="font-semibold">Confidence scores</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Every OCR region includes a confidence score. Low-confidence
              regions are flagged so you know exactly where to verify.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ImageDown className="text-primary h-5 w-5" />
              <h3 className="font-semibold">Auto-detect source</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Don&apos;t know what language is in the image? Leave source on
              auto — the pipeline figures it out.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
