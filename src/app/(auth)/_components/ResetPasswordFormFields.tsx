import { UseFormRegister } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { type ResetPasswordFormData } from '@/lib/validators';

interface ResetPasswordFormFieldsProps {
  register: UseFormRegister<ResetPasswordFormData>;
  errors: Record<string, any>;
}

export function ResetPasswordFormFields({
  register,
  errors,
}: ResetPasswordFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="new_password">New password</Label>
        <PasswordInput
          id="new_password"
          placeholder="Create a new password"
          autoComplete="new-password"
          {...register('new_password')}
        />
        {errors.new_password && (
          <p className="text-destructive text-sm" role="alert">
            {errors.new_password.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm your new password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
    </>
  );
}
