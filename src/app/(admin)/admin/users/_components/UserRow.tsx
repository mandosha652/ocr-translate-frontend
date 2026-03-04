'use client';

import { format } from 'date-fns';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import type { AdminUserSummary } from '@/types';

const TIER_STYLES: Record<string, string> = {
  free: 'border-border text-muted-foreground',
  pro: 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  enterprise:
    'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
};

const AVATAR_COLORS = [
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
];

function avatarColor(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++)
    hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function UserRow({ user }: { user: AdminUserSummary }) {
  const initials = user.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : user.email.slice(0, 2).toUpperCase();
  const colorClass = avatarColor(user.email);

  return (
    <Link href={`/admin/users/${user.id}`}>
      <div className="hover:bg-muted/50 group flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${colorClass}`}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm leading-tight font-medium">
            {user.email}
          </p>
          {user.name && (
            <p className="text-muted-foreground mt-0.5 truncate text-xs leading-tight">
              {user.name}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          <Badge
            variant="outline"
            className={`text-xs ${TIER_STYLES[user.tier] ?? ''}`}
          >
            {user.tier}
          </Badge>
          {!user.is_active && (
            <Badge variant="destructive" className="text-xs">
              Suspended
            </Badge>
          )}
          {!user.is_verified && (
            <Badge
              variant="outline"
              className="hidden border-amber-300 bg-amber-50 text-xs text-amber-700 sm:inline-flex dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
            >
              Unverified
            </Badge>
          )}
          <span className="text-muted-foreground hidden text-xs tabular-nums sm:block">
            {format(new Date(user.created_at), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function UserRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
      <div className="bg-muted h-8 w-8 shrink-0 animate-pulse rounded-full" />
      <div className="flex-1 space-y-1.5">
        <div className="bg-muted h-3.5 w-48 animate-pulse rounded" />
        <div className="bg-muted h-3 w-32 animate-pulse rounded" />
      </div>
      <div className="flex gap-2">
        <div className="bg-muted h-5 w-12 animate-pulse rounded-full" />
        <div className="bg-muted hidden h-3.5 w-20 animate-pulse rounded sm:block" />
      </div>
    </div>
  );
}
