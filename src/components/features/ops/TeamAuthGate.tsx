'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { teamTokenStorage } from '@/lib/api/team';
import { TEAM_SLUG } from '@/lib/constants';

interface TeamAuthGateProps {
  children: React.ReactNode;
}

export function TeamAuthGate({ children }: TeamAuthGateProps) {
  const router = useRouter();
  const [hasToken] = useState(() => {
    if (typeof window === 'undefined') return true; // SSR: don't block render
    return teamTokenStorage.has();
  });

  useEffect(() => {
    if (!hasToken) {
      router.replace(`/ops/${TEAM_SLUG}/login`);
    }
  }, [hasToken, router]);

  if (!hasToken) return null;

  return <>{children}</>;
}
