'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { AdminAuthGate } from '@/components/admin/AdminAuthGate';
import { AdminNav } from '@/components/admin/AdminNav';
import { adminKeyStorage } from '@/lib/api/admin';

// Note: Metadata export won't work in 'use client' components
// Admin pages are protected by robots.txt and middleware
// SEO: Never indexed (disallowed in robots.txt, protected by admin key)

let listeners: Array<() => void> = [];
function emitChange() {
  for (const listener of listeners) listener();
}

const subscribe = (onStoreChange: () => void) => {
  listeners = [...listeners, onStoreChange];
  return () => {
    listeners = listeners.filter(l => l !== onStoreChange);
  };
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasKey = useSyncExternalStore(
    subscribe,
    useCallback(() => adminKeyStorage.has(), []),
    () => null
  );

  // Avoid flash — wait for client-side check
  if (hasKey === null) return null;

  if (!hasKey) {
    return <AdminAuthGate onAuthenticated={emitChange} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
