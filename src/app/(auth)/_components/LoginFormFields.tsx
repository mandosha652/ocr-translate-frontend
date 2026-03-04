import Link from 'next/link';
import { UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { type LoginFormData } from '@/lib/validators';

interface LoginFormFieldsProps {
  register: UseFormRegister<LoginFormData>;
  errors: Record<string, any>;
  isLoggingIn: boolean;
}

export function LoginFormFields({
  register,
  errors,
  isLoggingIn,
}: LoginFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-destructive text-sm" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-primary focus-visible:ring-ring/50 rounded text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            tabIndex={isLoggingIn ? -1 : undefined}
            aria-disabled={isLoggingIn}
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-destructive text-sm" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>
    </>
  );
}
