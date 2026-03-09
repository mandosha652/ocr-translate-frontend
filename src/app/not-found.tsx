import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo size="lg" />
      <div className="space-y-2">
        <h1 className="text-6xl font-bold tracking-tight">404</h1>
        <p className="text-muted-foreground text-lg">Page not found</p>
        <p className="text-muted-foreground text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
