'use client';

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface DesktopNavProps {
  navItems: NavItem[];
  pathname: string;
}

export function DesktopNav({ navItems, pathname }: DesktopNavProps) {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className="focus-visible:ring-ring/50 rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          <Button
            variant="ghost"
            className={cn(
              'gap-2',
              pathname === item.href && 'bg-accent font-medium'
            )}
            tabIndex={-1}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
}
