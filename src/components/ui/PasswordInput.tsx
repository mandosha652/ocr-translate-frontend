'use client';

import { forwardRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePasswordToggle } from '@/hooks/shared/usePasswordToggle';
import { cn } from '@/lib/utils/cn';

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const { toggle, inputType, Icon } = usePasswordToggle();

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={inputType}
          className={cn('pr-10', className)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={toggle}
          tabIndex={-1}
          aria-label={
            inputType === 'password' ? 'Show password' : 'Hide password'
          }
        >
          <Icon className="text-muted-foreground h-4 w-4" />
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
