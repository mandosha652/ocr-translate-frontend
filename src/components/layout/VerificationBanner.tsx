'use client';

import { useState } from 'react';
import { MailWarning, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks';
import { authApi } from '@/lib/api/auth';

export function VerificationBanner() {
  const { user, isLoading } = useAuth();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  );

  if (isLoading || !user || user.is_verified) return null;

  const handleResend = async () => {
    setStatus('sending');
    try {
      await authApi.resendVerification();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="border-b border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40">
      <div className="container mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-300">
        {status === 'sent' ? (
          <CheckCircle className="h-4 w-4 shrink-0" />
        ) : (
          <MailWarning className="h-4 w-4 shrink-0" />
        )}
        <p>
          {status === 'sent'
            ? 'Verification email sent! Check your inbox.'
            : status === 'error'
              ? 'Failed to send. Please try again.'
              : 'Please verify your email address to unlock all features.'}
        </p>
        {status !== 'sent' && (
          <button
            onClick={handleResend}
            disabled={status === 'sending'}
            className="ml-auto shrink-0 cursor-pointer font-medium underline underline-offset-2 hover:no-underline focus-visible:ring-2 focus-visible:ring-amber-600/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'sending' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              'Resend email'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
