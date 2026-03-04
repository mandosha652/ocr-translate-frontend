'use client';

import { Languages } from 'lucide-react';
import Link from 'next/link';

export function HomeFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            <span className="font-semibold">ImgText</span>
          </div>
          <div className="text-muted-foreground flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/api-docs"
              className="hover:text-foreground focus-visible:text-foreground focus-visible:ring-ring/50 rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              API Docs
            </Link>
            <Link
              href="/help"
              className="hover:text-foreground focus-visible:text-foreground focus-visible:ring-ring/50 rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Help &amp; FAQ
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground focus-visible:text-foreground focus-visible:ring-ring/50 rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground focus-visible:text-foreground focus-visible:ring-ring/50 rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Privacy
            </Link>
          </div>
          <p className="text-muted-foreground text-center text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} ImgText. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
