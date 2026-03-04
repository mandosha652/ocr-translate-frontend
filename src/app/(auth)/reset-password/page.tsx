'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useResetPasswordForm } from '@/hooks';

import { InvalidTokenCard } from '../_components/InvalidTokenCard';
import { ResetPasswordFormFields } from '../_components/ResetPasswordFormFields';
import { ResetPasswordSuccessCard } from '../_components/ResetPasswordSuccessCard';

function ResetPasswordForm() {
  const { token, register, handleSubmit, errors, isLoading, succeeded } =
    useResetPasswordForm();

  if (!token) {
    return <InvalidTokenCard />;
  }

  if (succeeded) {
    return <ResetPasswordSuccessCard />;
  }

  return (
    <Card className="mx-4 w-full max-w-md sm:mx-0">
      <CardHeader className="space-y-2 px-4 sm:space-y-3 sm:px-6">
        <CardTitle className="text-xl font-bold sm:text-2xl">
          Reset password
        </CardTitle>
        <CardDescription className="text-sm">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} aria-busy={isLoading}>
        <fieldset disabled={isLoading}>
          <CardContent className="space-y-4 px-4 sm:space-y-6 sm:px-6">
            <ResetPasswordFormFields register={register} errors={errors} />
          </CardContent>
          <CardFooter className="flex flex-col gap-3 px-4 pt-4 sm:gap-4 sm:px-6 sm:pt-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Set new password
            </Button>
            <p className="text-muted-foreground text-center text-xs sm:text-sm">
              Remember your password?{' '}
              <Link
                href="/login"
                className="text-primary hover:underline"
                tabIndex={isLoading ? -1 : undefined}
                aria-disabled={isLoading}
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </fieldset>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Card className="mx-4 w-full max-w-md sm:mx-0">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
