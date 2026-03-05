import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { getPasswordStrength, type RegisterFormData } from '@/lib/validators';

interface SignupFormFieldsProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  passwordValue: string;
  onPasswordChange: (value: string) => void;
}

function PasswordStrengthIndicator({ value }: { value: string }) {
  if (!value) return null;
  const strength = getPasswordStrength(value);
  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= strength.score ? strength.color : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">{strength.label}</p>
    </div>
  );
}

export function SignupFormFields({
  register,
  errors,
  passwordValue,
  onPasswordChange,
}: SignupFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Name (optional)</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          {...register('name')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-destructive text-sm" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Create a password"
          autoComplete="new-password"
          {...register('password')}
          onChange={e => onPasswordChange(e.target.value)}
        />
        <PasswordStrengthIndicator value={passwordValue} />
        {errors.password ? (
          <p className="text-destructive text-sm" role="alert">
            {errors.password.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm your password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword ? (
          <p className="text-destructive text-sm" role="alert">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>
    </>
  );
}
