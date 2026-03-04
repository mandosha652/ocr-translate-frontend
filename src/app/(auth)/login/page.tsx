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
import { useLoginForm } from '@/hooks';

import { LoginFormFields } from '../_components/LoginFormFields';

function LoginForm() {
  const { register, handleSubmit, errors, isLoggingIn, loginError } =
    useLoginForm();

  return (
    <Card className="mx-4 w-full max-w-md sm:mx-0">
      <CardHeader className="space-y-2 px-4 sm:space-y-3 sm:px-6">
        <CardTitle className="text-xl font-bold sm:text-2xl">Sign in</CardTitle>
        <CardDescription className="text-sm">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} aria-busy={isLoggingIn}>
        <fieldset disabled={isLoggingIn}>
          <CardContent className="space-y-4 px-4 sm:space-y-6 sm:px-6">
            <LoginFormFields
              register={register}
              errors={errors}
              isLoggingIn={isLoggingIn}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3 px-4 pt-4 sm:gap-4 sm:px-6 sm:pt-6">
            {loginError && (
              <p
                className="text-destructive w-full text-center text-sm"
                role="alert"
              >
                {loginError}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
            <p className="text-muted-foreground text-center text-xs sm:text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-primary hover:underline"
                tabIndex={isLoggingIn ? -1 : undefined}
                aria-disabled={isLoggingIn}
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </fieldset>
      </form>
    </Card>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
