import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';

export function TermsFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <Logo size="sm" />
          <div className="text-muted-foreground flex gap-4 text-sm">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/help" className="hover:underline">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
