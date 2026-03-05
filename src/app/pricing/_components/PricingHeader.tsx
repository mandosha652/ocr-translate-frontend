import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

export function PricingHeader() {
  const { user } = useAuth();

  return (
    <header className="border-primary/10 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
        <Link
          href="/"
          className="hover:text-primary text-xl font-bold tracking-tight transition-colors"
        >
          ImgText
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
