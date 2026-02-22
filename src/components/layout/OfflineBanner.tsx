'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    if (!navigator.onLine) handleOffline();

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="border-b border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/40">
      <div className="container mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 text-sm text-red-800 dark:text-red-300">
        <WifiOff className="h-4 w-4 shrink-0" />
        <p>
          You are offline. Translations and API calls will not work until your
          connection is restored.
        </p>
      </div>
    </div>
  );
}
