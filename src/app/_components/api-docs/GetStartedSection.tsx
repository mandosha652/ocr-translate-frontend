import { Key, Terminal } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function GetStartedSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Get started</h2>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center py-8 text-center">
          <Key className="text-muted-foreground mb-3 h-8 w-8" />
          <p className="font-medium">Create an API key to begin</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Go to Settings to generate your first API key.
          </p>
          <Link href="/settings" className="mt-4">
            <Button size="sm" className="gap-2">
              <Terminal className="h-4 w-4" />
              Go to Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
