'use client';

import type { User } from '@/types';

interface WelcomeHeaderProps {
  user: User | null | undefined;
  isNewUser: boolean;
}

export function WelcomeHeader({ user, isNewUser }: WelcomeHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Welcome{user?.name ? `, ${user.name}` : ''}
      </h1>
      <p className="text-muted-foreground mt-2">
        {isNewUser
          ? 'Start by translating your first image.'
          : 'Get started by translating an image or view your recent jobs.'}
      </p>
    </div>
  );
}
