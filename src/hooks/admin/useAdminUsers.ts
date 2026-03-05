'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminApi, type AdminUsersParams } from '@/lib/api/admin';
import type { AdminCreateUser, AdminUpdateUser } from '@/types';

import { adminEnabled } from './adminEnabled';

export function useAdminUsers(params: AdminUsersParams = {}) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.listUsers(params),
    enabled: adminEnabled(),
  });
}

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: () => adminApi.getUser(userId),
    enabled: adminEnabled() && !!userId,
  });
}

export function useAdminCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminCreateUser) => adminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useAdminUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AdminUpdateUser }) =>
      adminApi.updateUser(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useAdminDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useAdminImpersonateUser() {
  return useMutation({
    mutationFn: (userId: string) => adminApi.impersonateUser(userId),
  });
}

export function useAdminResendVerification() {
  return useMutation({
    mutationFn: (userId: string) => adminApi.resendVerification(userId),
  });
}

export function useAdminUserApiKeys(userId: string) {
  return useQuery({
    queryKey: ['admin', 'users', userId, 'api-keys'],
    queryFn: () => adminApi.getUserApiKeys(userId),
    enabled: adminEnabled() && !!userId,
  });
}

export function useAdminRevokeUserApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, keyId }: { userId: string; keyId: string }) =>
      adminApi.revokeUserApiKey(userId, keyId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users', userId, 'api-keys'],
      });
    },
  });
}
