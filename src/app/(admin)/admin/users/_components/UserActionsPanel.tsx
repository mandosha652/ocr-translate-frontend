'use client';

import {
  BadgeCheck,
  ChevronDown,
  FolderX,
  Mail,
  Shield,
  Trash2,
  UserCog,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAdminDeleteUser,
  useAdminImpersonateUser,
  useAdminResendVerification,
  useAdminUpdateUser,
  useAdminWipeTenantFiles,
} from '@/hooks';

interface UserActionsPanelProps {
  userId: string;
  email: string;
  tier: 'free' | 'pro' | 'enterprise';
  userType: 'customer' | 'team';
  isActive: boolean;
  isVerified: boolean;
}

export function UserActionsPanel({
  userId,
  email,
  tier,
  userType,
  isActive,
  isVerified,
}: UserActionsPanelProps) {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState(tier);
  const [selectedUserType, setSelectedUserType] = useState(userType);
  const [dangerOpen, setDangerOpen] = useState(false);

  const updateUser = useAdminUpdateUser();
  const deleteUser = useAdminDeleteUser();
  const impersonateUser = useAdminImpersonateUser();
  const wipeTenantFiles = useAdminWipeTenantFiles();
  const resendVerification = useAdminResendVerification();

  const handleSaveTier = () => {
    updateUser.mutate(
      { userId, data: { tier: selectedTier } },
      { onSuccess: () => toast.success('Tier updated') }
    );
  };

  const handleSaveUserType = () => {
    updateUser.mutate(
      { userId, data: { user_type: selectedUserType } },
      { onSuccess: () => toast.success('User type updated') }
    );
  };

  const handleToggleActive = () => {
    updateUser.mutate(
      { userId, data: { is_active: !isActive } },
      {
        onSuccess: () =>
          toast.success(isActive ? 'User suspended' : 'User reactivated'),
      }
    );
  };

  const handleImpersonate = async () => {
    try {
      const res = await impersonateUser.mutateAsync(userId);
      await navigator.clipboard.writeText(res.access_token);
      toast.success('Token copied to clipboard', {
        description: `Expires in ${Math.round(res.expires_in_seconds / 60)} min — use as Bearer token`,
      });
    } catch {
      toast.error('Failed to impersonate user');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(userId);
      toast.success('User deleted');
      router.push('/admin/users');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleVerifyEmail = () => {
    updateUser.mutate(
      { userId, data: { is_verified: true } },
      { onSuccess: () => toast.success('Email marked as verified') }
    );
  };

  const handleResendVerification = async () => {
    try {
      await resendVerification.mutateAsync(userId);
      toast.success('Verification email queued');
    } catch {
      toast.error('Failed to resend verification email');
    }
  };

  const handleWipeFiles = async () => {
    try {
      const res = await wipeTenantFiles.mutateAsync(userId);
      toast.success('R2 files wiped', {
        description: `${res.files_deleted} files deleted${res.errors > 0 ? `, ${res.errors} errors` : ''}`,
      });
    } catch {
      toast.error('Failed to wipe tenant files');
    }
  };

  return (
    <div className="space-y-5">
      {/* Tier management */}
      <div>
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          Plan Tier
        </p>
        <div className="flex gap-2">
          <Select
            value={selectedTier}
            onValueChange={v =>
              setSelectedTier(v as 'free' | 'pro' | 'enterprise')
            }
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSaveTier}
            disabled={selectedTier === tier || updateUser.isPending}
            size="sm"
          >
            Save
          </Button>
        </div>
      </div>

      {/* User type */}
      <div>
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          User Type
        </p>
        <div className="flex gap-2">
          <Select
            value={selectedUserType}
            onValueChange={v => setSelectedUserType(v as 'customer' | 'team')}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="team">Team (VA)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSaveUserType}
            disabled={selectedUserType === userType || updateUser.isPending}
            size="sm"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          Actions
        </p>
        <div className="space-y-2">
          {!isVerified && (
            <>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleVerifyEmail}
                disabled={updateUser.isPending}
              >
                <BadgeCheck className="h-4 w-4 text-emerald-500" />
                Mark Email Verified
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleResendVerification}
                disabled={resendVerification.isPending}
              >
                <Mail className="h-4 w-4" />
                {resendVerification.isPending
                  ? 'Sending...'
                  : 'Resend Verification Email'}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            className={`w-full justify-start gap-2 ${isActive ? 'hover:border-orange-300 hover:text-orange-600' : ''}`}
            onClick={handleToggleActive}
            disabled={updateUser.isPending}
          >
            <UserCog
              className={`h-4 w-4 ${!isActive ? 'text-emerald-500' : ''}`}
            />
            {isActive ? 'Suspend User' : 'Reactivate User'}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleImpersonate}
            disabled={impersonateUser.isPending}
          >
            <Shield className="h-4 w-4 text-blue-500" />
            {impersonateUser.isPending
              ? 'Generating...'
              : 'Impersonate (copy token)'}
          </Button>
        </div>
      </div>

      {/* Danger zone */}
      <div>
        <button
          onClick={() => setDangerOpen(v => !v)}
          className="text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center justify-between text-xs font-medium tracking-wide uppercase transition-colors focus-visible:outline-none"
        >
          <span>Danger Zone</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${dangerOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {dangerOpen && (
          <div className="border-destructive/20 bg-destructive/5 mt-2 space-y-2 rounded-lg border p-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  disabled={wipeTenantFiles.isPending}
                >
                  <FolderX className="h-4 w-4" />
                  {wipeTenantFiles.isPending
                    ? 'Wiping...'
                    : 'Wipe R2 Files (GDPR)'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Wipe all files for {email}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Deletes all R2 storage files (images) for this tenant.
                    Database records are kept — use Delete User for full
                    removal. Cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleWipeFiles}
                    className="bg-orange-600 text-white hover:bg-orange-700"
                  >
                    Wipe files
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full justify-start gap-2"
                  disabled={deleteUser.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete User Permanently
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {email}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes the user and all their data
                    including batches, jobs, and API keys. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
