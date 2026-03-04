import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

export function PricingHeader() {
  const { user } = useAuth();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ImgText
        </Link>
        <div className="flex items-center gap-3">
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
                <Button size="sm">Sign up free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
