'use client';

export function OutputsSection() {
  return (
    <section className="bg-muted/50 border-t">
      <div className="container mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-center text-3xl font-bold">
          Three outputs per image
        </h2>
        <p className="text-muted-foreground mt-3 text-center">
          Every translation returns all three — use whichever you need.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="bg-background rounded-xl border p-6">
            <h3 className="font-semibold">Translated image</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              The final output. Original image with translated text rendered
              back in position. Ready to publish, share, or print.
            </p>
          </div>
          <div className="bg-background rounded-xl border p-6">
            <h3 className="font-semibold">Text-removed image</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              The image with all text erased and background reconstructed. Use
              as a clean base if you want to apply your own typography.
            </p>
          </div>
          <div className="bg-background rounded-xl border p-6">
            <h3 className="font-semibold">Region breakdown</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Every detected text region with original text, translation,
              position, and OCR confidence score — for validation or downstream
              automation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
