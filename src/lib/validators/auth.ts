import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    email: z.email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    name: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const apiKeySchema = z.object({
  name: z.string().max(255, 'Name must be less than 255 characters').optional(),
  expires_in_days: z.coerce
    .number()
    .int()
    .min(1, 'Must be at least 1 day')
    .max(365, 'Must be at most 365 days')
    .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
