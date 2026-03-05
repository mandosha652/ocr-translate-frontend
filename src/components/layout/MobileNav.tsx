'use client';

import { LogOut, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import type { NavItem } from '@/components/layout/DesktopNav';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { User } from '@/types/auth';

interface MobileNavProps {
  navItems: NavItem[];
  pathname: string;
  user: User | null;
  initials: string;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileNav({
  navItems,
  pathname,
  user,
  initials,
  onClose,
  onLogout,
}: MobileNavProps) {
  const { theme, setTheme } = useTheme();
  return (
    <div className="animate-in slide-in-from-top-2 border-t duration-200 md:hidden">
      <nav className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3',
                  pathname === item.href && 'bg-accent'
                )}
                onClick={onClose}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
          <div className="mt-3 space-y-1 border-t pt-3">
            <div className="flex items-center gap-3 px-4 py-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5">
                {user?.name ? (
                  <p className="text-sm font-medium">{user.name}</p>
                ) : null}
                <p className="text-muted-foreground text-xs">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
                onClose();
              }}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button
              variant="ghost"
              className="text-destructive w-full justify-start gap-3"
              onClick={() => {
                onClose();
                onLogout();
              }}
            >
              <LogOut className="h-5 w-5" />
              Log out
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
