import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { shouldBypassAuth } from '@/config/env';

// Mock user for development
const DEV_USER: User = {
  id: 'dev-user-id',
  email: 'dev@example.com',
  name: 'Dev User',
  tier: 'pro',
  is_active: true,
  is_verified: true,
  created_at: new Date().toISOString(),
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: shouldBypassAuth ? DEV_USER : null,
      isAuthenticated: shouldBypassAuth,
      isLoading: !shouldBypassAuth,

      setUser: user =>
        set({
          user: shouldBypassAuth ? DEV_USER : user,
          isAuthenticated: shouldBypassAuth || !!user,
          isLoading: false,
        }),

      setLoading: isLoading =>
        set({ isLoading: shouldBypassAuth ? false : isLoading }),

      logout: () =>
        set({
          user: shouldBypassAuth ? DEV_USER : null,
          isAuthenticated: shouldBypassAuth,
          isLoading: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
