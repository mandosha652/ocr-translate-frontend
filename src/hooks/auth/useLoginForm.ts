import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/utils';
import { type LoginFormData, loginSchema } from '@/lib/validators';

export function useLoginForm() {
  const { loginAsync, isLoggingIn } = useAuth();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get('callbackUrl') || '/dashboard';
  const callbackUrl =
    rawCallback.startsWith('/') && !rawCallback.startsWith('//')
      ? rawCallback
      : '/dashboard';
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    try {
      await loginAsync(data, callbackUrl);
      toast.success('Welcome back!');
      attemptPasswordSave(data.email, data.password);
    } catch (error) {
      const msg = getErrorMessage(error, 'Invalid email or password');
      toast.error(msg);
      setLoginError(msg);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoggingIn,
    loginError,
  };
}

function attemptPasswordSave(email: string, password: string) {
  if (
    typeof window !== 'undefined' &&
    window.PasswordCredential &&
    navigator.credentials
  ) {
    const cred = new window.PasswordCredential({
      id: email,
      password,
    });
    navigator.credentials.store(cred).catch(() => {
      // Silently fail if not supported
    });
  }
}

declare global {
  interface Window {
    PasswordCredential?: new (data: {
      id: string;
      password: string;
    }) => Credential;
  }
}
