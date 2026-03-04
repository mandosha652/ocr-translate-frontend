import { ArrowLeft, Languages } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function TermsHeader() {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Languages className="h-6 w-6" />
          <span className="text-lg font-semibold">ImgText</span>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>
    </header>
  );
}
