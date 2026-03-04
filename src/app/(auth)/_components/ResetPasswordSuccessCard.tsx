import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';

export function ResetPasswordSuccessCard() {
  return (
    <Card className="mx-4 w-full max-w-md sm:mx-0">
      <CardContent className="flex flex-col items-center gap-4 px-4 py-10 sm:px-6">
        <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
          <CheckCircle className="text-primary h-7 w-7" />
        </div>
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold sm:text-xl">Password updated</h2>
          <p className="text-muted-foreground text-sm">
            Your password has been reset. Sign in with your new password.
          </p>
        </div>
        <Link href="/login" className="text-primary text-sm hover:underline">
          Sign in
        </Link>
      </CardContent>
    </Card>
  );
}
