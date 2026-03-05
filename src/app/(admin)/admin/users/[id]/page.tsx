'use client';

import { AlertTriangle, Calendar, Clock, Hash } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { InfoRow } from '@/components/admin/InfoRow';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAdminUser, useAdminUserApiKeys } from '@/hooks';

import { ApiKeyList } from '../_components/ApiKeyList';
import { UserActionsPanel } from '../_components/UserActionsPanel';
import { UserProfileCard } from './_components/UserProfileCard';
import { UserStatsSection } from './_components/UserStatsSection';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error } = useAdminUser(id);
  const { data: apiKeys } = useAdminUserApiKeys(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-muted h-8 w-8 animate-pulse rounded-lg" />
          <div className="flex items-center gap-3">
            <div className="bg-muted h-10 w-10 animate-pulse rounded-full" />
            <div>
              <div className="bg-muted mb-1.5 h-5 w-48 animate-pulse rounded" />
              <div className="bg-muted h-3.5 w-32 animate-pulse rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-muted h-20 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <div className="bg-destructive/10 rounded-full p-3">
          <AlertTriangle className="text-destructive h-5 w-5" />
        </div>
        <p className="text-destructive font-semibold">User not found</p>
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            Back to Users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserProfileCard user={user} />

      <UserStatsSection user={user} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Account Info</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <InfoRow
              label="User ID"
              icon={Hash}
              value={
                <span className="text-muted-foreground font-mono text-xs break-all">
                  {user.id}
                </span>
              }
            />
            <InfoRow label="Joined" icon={Calendar} value={user.created_at} />
            <InfoRow label="Updated" icon={Clock} value={user.updated_at} />
            <InfoRow
              label="Last Active"
              icon={Clock}
              value={
                user.last_activity ? (
                  user.last_activity
                ) : (
                  <span className="text-muted-foreground">Never</span>
                )
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Admin Actions</CardTitle>
            <CardDescription>Manage this user account</CardDescription>
          </CardHeader>
          <CardContent>
            <UserActionsPanel
              userId={user.id}
              email={user.email}
              tier={user.tier}
              userType={user.user_type ?? 'customer'}
              isActive={user.is_active}
              isVerified={user.is_verified}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">API Keys</CardTitle>
          <CardDescription>
            {apiKeys && apiKeys.length > 0
              ? `${apiKeys.length} active key${apiKeys.length !== 1 ? 's' : ''}`
              : 'Active keys for this user'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeyList userId={user.id} apiKeys={apiKeys} />
        </CardContent>
      </Card>
    </div>
  );
}
