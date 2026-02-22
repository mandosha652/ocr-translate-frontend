'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';
import { AxiosError } from 'axios';

type VerifyState = 'loading' | 'success' | 'error' | 'missing_token';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState<VerifyState>(
    token ? 'loading' : 'missing_token'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!token) return;

    authApi
      .verifyEmail({ token })
      .then(() => setState('success'))
      .catch((error: AxiosError<{ detail: string }>) => {
        setErrorMessage(
          error.response?.data?.detail ||
            'This verification link is invalid or has expired.'
        );
        setState('error');
      });
  }, [token]);

  if (state === 'loading') {
    return (
      <Card className="mx-4 w-full max-w-md sm:mx-0">
        <CardContent className="flex flex-col items-center gap-4 px-4 py-10 sm:px-6">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
          <p className="text-muted-foreground text-sm">Verifying your email…</p>
        </CardContent>
      </Card>
    );
  }

  if (state === 'success') {
    return (
      <Card className="mx-4 w-full max-w-md sm:mx-0">
        <CardContent className="flex flex-col items-center gap-4 px-4 py-10 sm:px-6">
          <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
            <CheckCircle className="text-primary h-7 w-7" />
          </div>
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold sm:text-xl">
              Email verified!
            </h2>
            <p className="text-muted-foreground text-sm">
              Your email has been confirmed. Your account is now fully active.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-primary text-sm hover:underline"
          >
            Go to dashboard
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (state === 'missing_token') {
    return (
      <Card className="mx-4 w-full max-w-md sm:mx-0">
        <CardContent className="flex flex-col items-center gap-4 px-4 py-10 sm:px-6">
          <div className="bg-destructive/10 flex h-14 w-14 items-center justify-center rounded-full">
            <XCircle className="text-destructive h-7 w-7" />
          </div>
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold sm:text-xl">Invalid link</h2>
            <p className="text-muted-foreground text-sm">
              This verification link is incomplete. Please use the full link
              from your email.
            </p>
          </div>
          <Link href="/login" className="text-primary text-sm hover:underline">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  // state === 'error'
  return (
    <Card className="mx-4 w-full max-w-md sm:mx-0">
      <CardContent className="flex flex-col items-center gap-4 px-4 py-10 sm:px-6">
        <div className="bg-destructive/10 flex h-14 w-14 items-center justify-center rounded-full">
          <XCircle className="text-destructive h-7 w-7" />
        </div>
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold sm:text-xl">
            Verification failed
          </h2>
          <p className="text-muted-foreground text-sm">{errorMessage}</p>
        </div>
        <Link href="/login" className="text-primary text-sm hover:underline">
          Back to sign in
        </Link>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
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
      <VerifyEmailContent />
    </Suspense>
  );
}
