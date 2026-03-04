import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { authApi } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/utils';
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from '@/lib/validators';

export function useResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await authApi.resetPassword({
        token: token!,
        new_password: data.new_password,
      });
      setSucceeded(true);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'Reset link may be expired. Please request a new one.'
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    token,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    succeeded,
  };
}
