'use client';

import {
  History,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
  Sun,
  X,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import { DesktopNav } from '@/components/layout/DesktopNav';
import { LogoutDialog } from '@/components/layout/LogoutDialog';
import { MobileNav } from '@/components/layout/MobileNav';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { UserDropdown } from '@/components/layout/UserDropdown';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/hooks';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/translate', label: 'Translate', icon: ImageIcon },
  { href: '/batch', label: 'Batch', icon: Layers },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-4 md:gap-8">
          <Logo href="/dashboard" size="lg" />
          <DesktopNav navItems={navItems} pathname={pathname} />
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hidden sm:inline-flex"
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </TooltipContent>
          </Tooltip>

          <UserDropdown
            user={user}
            initials={initials}
            onLogout={() => setLogoutDialogOpen(true)}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <MobileNav
          navItems={navItems}
          pathname={pathname}
          user={user}
          initials={initials}
          onClose={() => setMobileMenuOpen(false)}
          onLogout={() => setLogoutDialogOpen(true)}
        />
      ) : null}

      <LogoutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleLogoutConfirm}
        isLoggingOut={isLoggingOut}
      />
    </header>
  );
}
