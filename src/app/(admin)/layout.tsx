'use client';

import { useLayoutEffect, useState } from 'react';

import { AdminAuthGate } from '@/components/admin/AdminAuthGate';
import { AdminNav } from '@/components/admin/AdminNav';
import { adminKeyStorage } from '@/lib/api/admin';

// Note: Metadata export won't work in 'use client' components
// Admin pages are protected by robots.txt and middleware
// SEO: Never indexed (disallowed in robots.txt, protected by admin key)

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    setHasKey(adminKeyStorage.has());
  }, []);

  // Avoid flash — wait for client-side check
  if (hasKey === null) return null;

  if (!hasKey) {
    return <AdminAuthGate onAuthenticated={() => setHasKey(true)} />;
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
