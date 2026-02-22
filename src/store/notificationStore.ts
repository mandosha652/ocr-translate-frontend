import { create } from 'zustand';

export interface AppNotification {
  id: string;
  message: string;
  href: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: string;
  read: boolean;
}

interface NotificationStore {
  notifications: AppNotification[];
  push: (n: Omit<AppNotification, 'id' | 'read'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationStore>(set => ({
  notifications: [],

  push: n =>
    set(state => ({
      notifications: [
        {
          ...n,
          id: crypto.randomUUID(),
          read: false,
        },
        ...state.notifications,
      ].slice(0, 20), // keep at most 20
    })),

  markAllRead: () =>
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    })),

  markRead: id =>
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  clear: () => set({ notifications: [] }),
}));
