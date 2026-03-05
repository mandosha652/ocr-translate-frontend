'use client';

import { MoveRight } from 'lucide-react';

export function DemoSection() {
  return (
    <section className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
        <div className="mb-14 text-center">
          <p className="text-primary mb-3 text-sm font-semibold tracking-widest uppercase">
            Live demo
          </p>
          <h2 className="mb-5 text-4xl leading-tight font-bold tracking-tight md:text-5xl">
            See it in action
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            Upload an image with text — get a translated image back in seconds
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-6">
          {/* Input */}
          <div className="flex flex-1 flex-col gap-4">
            <p className="text-muted-foreground text-center text-xs font-semibold tracking-widest uppercase">
              ➊ Input
            </p>
            <div className="border-border/50 bg-card relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border p-8">
              <div className="border-border/50 relative w-full space-y-2 rounded-lg border bg-slate-800 p-4 shadow-lg">
                <div className="h-3 w-3/4 rounded bg-slate-600" />
                <div className="h-3 w-full rounded bg-slate-600" />
                <div className="h-3 w-2/3 rounded bg-slate-600" />
                <div className="mt-4 h-3 w-1/2 rounded bg-slate-700" />
                <div className="h-3 w-5/6 rounded bg-slate-700" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                German text
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden items-center justify-center lg:flex">
            <div className="border-primary/20 bg-primary/5 flex h-12 w-12 items-center justify-center rounded-full border-2">
              <MoveRight className="text-primary h-6 w-6" />
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-1 flex-col gap-4">
            <p className="text-muted-foreground text-center text-xs font-semibold tracking-widest uppercase">
              ➌ Output
            </p>
            <div className="border-border/50 bg-card relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border p-8">
              <div className="border-border/50 relative w-full space-y-2 rounded-lg border bg-slate-800 p-4 shadow-lg">
                <div className="bg-primary/60 h-3 w-3/4 rounded" />
                <div className="bg-primary/60 h-3 w-full rounded" />
                <div className="bg-primary/60 h-3 w-2/3 rounded" />
                <div className="bg-primary/60 mt-4 h-3 w-1/2 rounded" />
                <div className="bg-primary/60 h-3 w-5/6 rounded" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                English translation
              </p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed">
          Text is detected, removed, and translated in the exact same position.
          No boxes, no transcripts — just a finished image ready to use.
        </p>
      </div>
    </section>
  );
}
