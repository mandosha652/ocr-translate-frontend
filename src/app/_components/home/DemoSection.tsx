'use client';

import { MoveRight } from 'lucide-react';

export function DemoSection() {
  return (
    <section className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-center text-3xl font-bold">See it in action</h2>
        <p className="text-muted-foreground mt-3 text-center">
          Upload an image with text — get a translated image back, with text
          rendered in the same position.
        </p>
        <div className="mt-12 flex flex-col items-center gap-6 md:flex-row md:items-stretch">
          <div className="flex flex-1 flex-col gap-3">
            <p className="text-muted-foreground text-center text-xs font-medium tracking-widest uppercase">
              Input
            </p>
            <div className="bg-muted flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border p-8">
              <div className="w-full space-y-2 rounded-lg border bg-white p-4 shadow-sm dark:bg-zinc-900">
                <div className="h-2.5 w-3/4 rounded bg-zinc-300 dark:bg-zinc-600" />
                <div className="h-2.5 w-full rounded bg-zinc-300 dark:bg-zinc-600" />
                <div className="h-2.5 w-2/3 rounded bg-zinc-300 dark:bg-zinc-600" />
                <div className="mt-3 h-2.5 w-1/2 rounded bg-zinc-300 dark:bg-zinc-600" />
                <div className="h-2.5 w-5/6 rounded bg-zinc-300 dark:bg-zinc-600" />
              </div>
              <p className="text-muted-foreground text-sm">
                Image with German text
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <MoveRight className="text-primary h-5 w-5" />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <p className="text-muted-foreground text-center text-xs font-medium tracking-widest uppercase">
              Output
            </p>
            <div className="bg-muted flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border p-8">
              <div className="w-full space-y-2 rounded-lg border bg-white p-4 shadow-sm dark:bg-zinc-900">
                <div className="bg-primary/20 h-2.5 w-3/4 rounded" />
                <div className="bg-primary/20 h-2.5 w-full rounded" />
                <div className="bg-primary/20 h-2.5 w-2/3 rounded" />
                <div className="bg-primary/20 mt-3 h-2.5 w-1/2 rounded" />
                <div className="bg-primary/20 h-2.5 w-5/6 rounded" />
              </div>
              <p className="text-muted-foreground text-sm">
                Same image, text translated to English
              </p>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Text is detected, removed, translated, and rendered back — in exactly
          the same position. You download a finished image.
        </p>
      </div>
    </section>
  );
}
