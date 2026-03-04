'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { shouldBypassAuth } from '@/config/env';
import { authApi, tokenStorage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function useCurrentUser() {
  const router = useRouter();
  const { user, setUser, setLoading } = useAuthStore();

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (shouldBypassAuth) {
        setLoading(false);
        return user;
      }
      if (!tokenStorage.hasTokens()) {
        setLoading(false);
        return null;
      }
      try {
        const userData = await authApi.getMe();
        setUser(userData);
        return userData;
      } catch {
        await tokenStorage.clearTokens();
        setUser(null);
        router.push('/login');
        return null;
      }
    },
    enabled: typeof window !== 'undefined',
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
