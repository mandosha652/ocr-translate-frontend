import { Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function ContactSection() {
  return (
    <section>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center py-10 text-center">
          <Mail className="text-muted-foreground mb-3 h-8 w-8" />
          <h2 className="text-lg font-semibold">Still need help?</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Can&apos;t find what you&apos;re looking for? Send us an email and
            we&apos;ll get back to you.
          </p>
          <a href="mailto:support@imgtext.io" className="mt-4">
            <Button className="gap-2">
              <Mail className="h-4 w-4" />
              support@imgtext.io
            </Button>
          </a>
        </CardContent>
      </Card>
    </section>
  );
}
