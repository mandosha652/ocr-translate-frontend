'use client';

import { Languages } from 'lucide-react';
import Link from 'next/link';

import { HomeNavActions } from '@/components/features/home/HomeActions';

export function HomeHeader() {
  return (
    <header className="border-border/60 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="focus-visible:ring-ring/50 flex items-center gap-2 rounded transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
        >
          <Languages className="text-primary h-6 w-6" />
          <span className="text-lg font-bold tracking-tight">ImgText</span>
        </Link>
        <HomeNavActions />
      </div>
    </header>
  );
}
