import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/utils';
import { type RegisterFormData, registerSchema } from '@/lib/validators';

export function useSignupForm() {
  const { registerAsync, isRegistering } = useAuth();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get('callbackUrl') || '/dashboard';
  const callbackUrl =
    rawCallback.startsWith('/') && !rawCallback.startsWith('//')
      ? rawCallback
      : '/dashboard';
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerAsync(
        {
          email: data.email,
          password: data.password,
          name: data.name,
        },
        callbackUrl
      );
      toast.success('Welcome to imgtext.io! 🎉');
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Couldn't create your account — please try again"
        )
      );
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isRegistering,
    passwordValue,
    setPasswordValue,
  };
}
