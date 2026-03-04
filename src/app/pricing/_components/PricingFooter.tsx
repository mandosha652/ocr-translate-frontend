import Link from 'next/link';

export function PricingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-6 py-8 text-sm">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Home
        </Link>
        <Link
          href="/api-docs"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          API Docs
        </Link>
        <Link
          href="/help"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Help
        </Link>
        <Link
          href="/terms"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Terms
        </Link>
        <Link
          href="/privacy"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Privacy
        </Link>
      </div>
    </footer>
  );
}
