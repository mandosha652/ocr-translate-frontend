import Link from 'next/link';

export function PricingFooter() {
  return (
    <footer className="border-primary/10 bg-muted/30 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            Home
          </Link>
          <div className="bg-border h-4 w-px" />
          <Link
            href="/case-studies"
            className="text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            Case Studies
          </Link>
          <div className="bg-border h-4 w-px" />
          <Link
            href="/api-docs"
            className="text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            API Docs
          </Link>
          <div className="bg-border h-4 w-px" />
          <Link
            href="/help"
            className="text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            Help
          </Link>
          <div className="bg-border h-4 w-px" />
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            Terms
          </Link>
          <div className="bg-border h-4 w-px" />
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            Privacy
          </Link>
        </div>
        <div className="border-primary/5 text-muted-foreground mt-8 border-t pt-8 text-center text-xs">
          <p>© {new Date().getFullYear()} ImgText. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
