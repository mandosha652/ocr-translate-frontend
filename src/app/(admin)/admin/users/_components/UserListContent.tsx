'use client';

import { AlertTriangle, UserCircle2 } from 'lucide-react';

import type { AdminUserSummary } from '@/types';

import { UserRow, UserRowSkeleton } from './UserRow';

interface UserListContentProps {
  isLoading: boolean;
  error: Error | null;
  users: AdminUserSummary[] | undefined;
}

export function UserListContent({
  isLoading,
  error,
  users,
}: UserListContentProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <UserRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <div className="bg-destructive/10 rounded-full p-3">
          <AlertTriangle className="text-destructive h-5 w-5" />
        </div>
        <p className="text-destructive font-medium">Failed to load users</p>
        <p className="text-muted-foreground text-sm">
          Check your admin key and try again
        </p>
      </div>
    );
  }

  if ((users?.length ?? 0) === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <UserCircle2 className="text-muted-foreground/40 h-10 w-10" />
        <p className="text-muted-foreground text-sm">
          No users found matching your filters
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {users?.map(user => (
        <UserRow key={user.id} user={user} />
      ))}
    </div>
  );
}
