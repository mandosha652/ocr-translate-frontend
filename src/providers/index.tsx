'use client';

import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    </QueryProvider>
  );
}
