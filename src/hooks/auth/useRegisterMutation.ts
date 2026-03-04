'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { RegisterRequest } from '@/types';

export function useRegisterMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ data }: { data: RegisterRequest; callbackUrl?: string }) =>
      authApi.register(data),
    onSuccess: (data, { callbackUrl }) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push(callbackUrl || '/dashboard');
    },
  });
}
