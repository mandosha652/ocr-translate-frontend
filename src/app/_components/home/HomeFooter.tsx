'use client';

import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';

export function HomeFooter() {
  return (
    <footer className="border-border/50 bg-muted/20 border-t">
      <div className="container mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-12 grid gap-8 md:grid-cols-3 md:gap-12">
          {/* Brand */}
          <div>
            <div className="mb-2">
              <Logo size="md" />
            </div>
            <p className="text-muted-foreground text-sm">
              AI-powered image translation for the global web.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-foreground mb-4 font-semibold">Product</p>
            <div className="space-y-3">
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-primary block text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/case-studies"
                className="text-muted-foreground hover:text-primary block text-sm font-medium transition-colors"
              >
                Case Studies
              </Link>
              <Link
                href="/api-docs"
                className="text-muted-foreground hover:text-primary block text-sm font-medium transition-colors"
              >
                API Docs
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-foreground mb-4 font-semibold">Company</p>
            <div className="space-y-3">
              <Link
                href="/help"
                className="text-muted-foreground hover:text-primary block text-sm font-medium transition-colors"
              >
                Help &amp; FAQ
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary block text-sm font-medium transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary block text-sm font-medium transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-border/50 border-t pt-8">
          <p className="text-muted-foreground/60 text-center text-xs">
            &copy; {new Date().getFullYear()} ImgText Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
