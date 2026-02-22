'use client';

import { shouldBypassAuth } from '@/config/env';

export function DevBypassBanner() {
  if (!shouldBypassAuth) return null;

  return (
    <div className="bg-amber-400 px-4 py-1.5 text-center text-xs font-medium text-amber-950">
      Dev auth bypass active — authentication is disabled.{' '}
      <code className="rounded bg-amber-300/60 px-1">
        NEXT_PUBLIC_DEV_AUTH_BYPASS=true
      </code>
    </div>
  );
}
