'use client';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

interface ProvidersProps {
  children: React.ReactNode;
  nonce?: string;
}

export function Providers({ children, nonce }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider nonce={nonce}>
        <TooltipProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
