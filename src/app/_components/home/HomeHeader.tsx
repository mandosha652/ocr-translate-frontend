'use client';

import { HomeNavActions } from '@/components/features/home/HomeActions';
import { Logo } from '@/components/ui/Logo';

export function HomeHeader() {
  return (
    <header className="border-border/60 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Logo href="/" size="md" />
        <HomeNavActions />
      </div>
    </header>
  );
}
