import { XCircle } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';

export function InvalidTokenCard() {
  return (
    <Card className="mx-4 w-full max-w-md sm:mx-0">
      <CardContent className="flex flex-col items-center gap-4 px-4 py-10 sm:px-6">
        <div className="bg-destructive/10 flex h-14 w-14 items-center justify-center rounded-full">
          <XCircle className="text-destructive h-7 w-7" />
        </div>
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold sm:text-xl">Invalid link</h2>
          <p className="text-muted-foreground text-sm">
            This password reset link is missing a token. Please request a new
            one.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="text-primary text-sm hover:underline"
        >
          Request new link
        </Link>
      </CardContent>
    </Card>
  );
}
