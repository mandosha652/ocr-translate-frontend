'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { shouldBypassAuth } from '@/config/env';
import { useAuthStore } from '@/store/authStore';

export function useCrossTabLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  useEffect(() => {
    if (shouldBypassAuth) return;

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'auth-storage' && event.newValue === null) {
        logout();
        queryClient.clear();
        router.push('/login');
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [logout, queryClient, router]);
}
