'use client';

import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  Hash,
  Image as ImageIcon,
  Languages,
  Layers,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { AdminUserDetail } from '@/types';

interface UserStatsSectionProps {
  user: AdminUserDetail;
}

export function UserStatsSection({ user }: UserStatsSectionProps) {
  const stats = [
    {
      label: 'User ID',
      value: user.id,
      icon: Hash,
    },
    {
      label: 'Joined',
      value: format(new Date(user.created_at), 'MMM d, yyyy'),
      icon: Calendar,
    },
    {
      label: 'Images Processed',
      value: user.total_images_processed,
      icon: ImageIcon,
    },
    {
      label: 'Batches',
      value: user.total_batches,
      icon: Layers,
    },
    {
      label: 'Translations',
      value: user.total_translations,
      icon: Languages,
    },
    {
      label: 'Last Active',
      value: user.last_activity
        ? format(new Date(user.last_activity), 'MMM d, yyyy HH:mm')
        : 'Never',
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="overflow-hidden">
          <CardContent className="flex flex-col gap-2 px-3 py-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                {label}
              </p>
              <Icon className="text-muted-foreground h-3.5 w-3.5" />
            </div>
            <p className="text-sm font-semibold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
