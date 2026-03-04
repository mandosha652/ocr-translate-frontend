'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/types';

import { EditProfileForm } from './EditProfileForm';

function AccountSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}

interface AccountInfoCardProps {
  user: User | null | undefined;
  isLoadingUser: boolean;
}

export function AccountInfoCard({ user, isLoadingUser }: AccountInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card id="account">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </div>
          {!isLoadingUser && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingUser ? (
          <AccountSkeleton />
        ) : (
          <>
            {isEditing ? (
              <EditProfileForm
                user={user}
                onSaveComplete={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-sm">{user?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <p className="text-sm">{user?.name}</p>
                  </div>
                </div>
              </>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Plan</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {user?.tier || 'Free'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={user?.is_active ? 'default' : 'destructive'}>
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  {user?.is_verified && (
                    <Badge variant="outline">Verified</Badge>
                  )}
                </div>
              </div>
            </div>
            {user?.created_at && (
              <div className="space-y-2">
                <Label>Member Since</Label>
                <p className="text-sm">
                  {format(new Date(user.created_at), 'MMMM d, yyyy')}
                  <span className="text-muted-foreground ml-2 text-xs">
                    (
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true,
                    })}
                    )
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
