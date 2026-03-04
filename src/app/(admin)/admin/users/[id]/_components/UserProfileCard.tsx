'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { avatarColor, TIER_STYLES } from '@/lib/constants/admin';
import type { AdminUserDetail } from '@/types';

interface UserProfileCardProps {
  user: AdminUserDetail;
}

function getInitials(name: string | null | undefined, email: string): string {
  if (name) {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const initials = getInitials(user.name, user.email);
  const color = avatarColor(user.email);
  const tierStyle = TIER_STYLES[user.tier];

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="hover:text-primary transition-colors"
        >
          <Button variant="ghost" size="sm" className="px-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-lg text-lg font-bold text-white ${color}`}
        >
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{user.name || user.email}</h1>
            <Badge className={tierStyle}>{user.tier}</Badge>
          </div>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
