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
import { useSignupForm } from '@/hooks';

import { SignupFormFields } from '../_components/SignupFormFields';

function SignupForm() {
  const {
    register,
    handleSubmit,
    errors,
    isRegistering,
    passwordValue,
    setPasswordValue,
  } = useSignupForm();

  return (
    <Card className="mx-4 w-full max-w-md sm:mx-0">
      <CardHeader className="space-y-2 px-4 sm:space-y-3 sm:px-6">
        <CardTitle className="text-xl font-bold sm:text-2xl">
          Create an account
        </CardTitle>
        <CardDescription className="text-sm">
          Enter your details to create your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} aria-busy={isRegistering}>
        <fieldset disabled={isRegistering}>
          <CardContent className="space-y-4 px-4 sm:space-y-6 sm:px-6">
            <SignupFormFields
              register={register}
              errors={errors}
              passwordValue={passwordValue}
              onPasswordChange={setPasswordValue}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3 px-4 pt-4 sm:gap-4 sm:px-6 sm:pt-6">
            <Button type="submit" className="w-full" disabled={isRegistering}>
              {isRegistering && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create account
            </Button>
            <p className="text-muted-foreground text-center text-xs sm:text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary focus-visible:ring-ring/50 rounded hover:underline focus-visible:ring-2 focus-visible:outline-none"
                tabIndex={isRegistering ? -1 : undefined}
                aria-disabled={isRegistering}
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

export default function SignupPage() {
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
      <SignupForm />
    </Suspense>
  );
}
