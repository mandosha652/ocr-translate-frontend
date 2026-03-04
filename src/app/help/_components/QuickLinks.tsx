import Link from 'next/link';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function QuickLinks() {
  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-2">
      <Link href="/api-docs">
        <Card className="hover:border-primary/50 cursor-pointer transition-colors">
          <CardHeader>
            <CardTitle className="text-base">API Reference</CardTitle>
            <CardDescription>
              Integrate ImgText into your pipeline
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
      <Link href="/settings">
        <Card className="hover:border-primary/50 cursor-pointer transition-colors">
          <CardHeader>
            <CardTitle className="text-base">API Keys</CardTitle>
            <CardDescription>
              Create and manage API keys for programmatic access
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
}
