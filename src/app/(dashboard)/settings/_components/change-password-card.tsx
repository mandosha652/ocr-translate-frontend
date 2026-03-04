'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useAuth, useChangePassword } from '@/hooks';
import { tokenStorage } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import {
  type ChangePasswordFormData,
  changePasswordSchema,
} from '@/lib/validators';

function PasswordField({
  id,
  label,
  autoComplete,
  disabled,
  error,
  register,
}: {
  id: string;
  label: string;
  autoComplete: string;
  disabled: boolean;
  error?: string;
  register: UseFormRegisterReturn;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <PasswordInput
        id={id}
        autoComplete={autoComplete}
        disabled={disabled}
        {...register}
      />
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

export function ChangePasswordCard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword.mutateAsync({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      toast.success('Password changed — please log in again');
      tokenStorage.clearTokens();
      queryClient.clear();
      logout();
      router.push('/login');
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err, "Couldn't update your password — please try again")
      );
    }
  };

  return (
    <Card id="password">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="text-muted-foreground h-4 w-4" />
          <div>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password. You will be signed out immediately.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm space-y-4">
          <PasswordField
            id="currentPassword"
            label="Current password"
            autoComplete="current-password"
            disabled={changePassword.isPending}
            error={errors.currentPassword?.message}
            register={register('currentPassword')}
          />
          <PasswordField
            id="newPassword"
            label="New password"
            autoComplete="new-password"
            disabled={changePassword.isPending}
            error={errors.newPassword?.message}
            register={register('newPassword')}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm new password"
            autoComplete="new-password"
            disabled={changePassword.isPending}
            error={errors.confirmPassword?.message}
            register={register('confirmPassword')}
          />
          <Button type="submit" disabled={changePassword.isPending}>
            {changePassword.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
