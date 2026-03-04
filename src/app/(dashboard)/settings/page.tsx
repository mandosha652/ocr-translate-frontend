'use client';

import { useAuth } from '@/hooks';

import { AccountInfoCard } from './_components/account-info-card';
import { ApiKeysCard } from './_components/api-keys-card';
import { ChangePasswordCard } from './_components/change-password-card';
import { DangerZoneCard } from './_components/danger-zone-card';
import { NotificationPrefsCard } from './_components/notification-prefs-card';

export default function SettingsPage() {
  const { user, isLoading: isLoadingUser } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and API keys
        </p>
      </div>
      <div className="flex gap-6 md:gap-8">
        <nav className="hidden w-44 shrink-0 md:block">
          <ul className="sticky top-24 space-y-1 text-sm">
            {[
              { label: 'Account', href: '#account' },
              { label: 'Password', href: '#password' },
              { label: 'API Keys', href: '#api-keys' },
              { label: 'Notifications', href: '#notifications' },
              { label: 'Danger Zone', href: '#danger-zone' },
            ].map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 block rounded-md px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-1 space-y-8">
          <AccountInfoCard user={user} isLoadingUser={isLoadingUser} />
          <ChangePasswordCard />
          <ApiKeysCard />
          <NotificationPrefsCard />
          <DangerZoneCard />
        </div>
      </div>
    </div>
  );
}
