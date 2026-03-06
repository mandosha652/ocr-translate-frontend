'use client';

import { CheckCircle, Loader2, MailWarning } from 'lucide-react';
import { useState } from 'react';

import { authApi } from '@/lib/api/auth';

export function VerifyEmailNotice() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  );

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
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
      {status === 'sent' ? (
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <MailWarning className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <div className="flex-1 space-y-1">
        <p className="font-medium">
          {status === 'sent'
            ? 'Verification email sent!'
            : 'Email verification required'}
        </p>
        <p className="text-amber-700 dark:text-amber-400">
          {status === 'sent'
            ? 'Check your inbox and click the link to verify your email.'
            : status === 'error'
              ? 'Failed to send verification email. Please try again.'
              : 'Verify your email address to start translating images.'}
        </p>
      </div>
      {status !== 'sent' && (
        <button
          onClick={handleResend}
          disabled={status === 'sending'}
          className="shrink-0 cursor-pointer rounded-md px-3 py-1 font-medium underline underline-offset-2 hover:no-underline focus-visible:ring-2 focus-visible:ring-amber-600/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'sending' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            'Resend'
          )}
        </button>
      )}
    </div>
  );
}
