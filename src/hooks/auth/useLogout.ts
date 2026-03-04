'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { adminKeyStorage, authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useCallback(async () => {
    await authApi.logout();
    logout();
    adminKeyStorage.clear();
    queryClient.clear();
    router.push('/login');
  }, [logout, queryClient, router]);
}
