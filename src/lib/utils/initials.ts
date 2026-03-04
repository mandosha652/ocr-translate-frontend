import type { User } from '@/types/auth';

export function getInitials(user: User | null): string {
  if (!user) return '?';
  if (user.name) {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  }
  return (user.email?.[0] ?? '?').toUpperCase();
}
