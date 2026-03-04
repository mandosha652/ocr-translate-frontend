'use client';

import { useCallback, useEffect } from 'react';

import { shouldBypassAuth } from '@/config/env';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest, RegisterRequest } from '@/types';

import { useCrossTabLogout } from './auth/useCrossTabLogout';
import { useCurrentUser } from './auth/useCurrentUser';
import { useLoginMutation } from './auth/useLoginMutation';
import { useLogout } from './auth/useLogout';
import { useRegisterMutation } from './auth/useRegisterMutation';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setLoading } = useAuthStore();

  const { refetch: refetchUser } = useCurrentUser();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const handleLogout = useLogout();

  useCrossTabLogout();

  useEffect(() => {
    if (shouldBypassAuth) {
      setLoading(false);
    }
  }, [setLoading]);

  const login = useCallback(
    (data: LoginRequest, callbackUrl?: string) =>
      loginMutation.mutate({ data, callbackUrl }),
    [loginMutation]
  );

  const loginAsync = useCallback(
    (data: LoginRequest, callbackUrl?: string) =>
      loginMutation.mutateAsync({ data, callbackUrl }),
    [loginMutation]
  );

  const register = useCallback(
    (data: RegisterRequest, callbackUrl?: string) =>
      registerMutation.mutate({ data, callbackUrl }),
    [registerMutation]
  );

  const registerAsync = useCallback(
    (data: RegisterRequest, callbackUrl?: string) =>
      registerMutation.mutateAsync({ data, callbackUrl }),
    [registerMutation]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register,
    registerAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: handleLogout,
    refetchUser,
  };
}
