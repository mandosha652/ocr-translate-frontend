import Link from 'next/link';

import { CodeBlock } from './CodeBlock';

export function AuthenticationSection() {
  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-xl font-semibold">Authentication</h2>
      <p className="text-muted-foreground text-sm">
        All API requests require an API key. Create one in{' '}
        <Link
          href="/settings"
          className="text-primary underline underline-offset-4"
        >
          Settings → API Keys
        </Link>
        . Pass it in the{' '}
        <code className="bg-muted rounded px-1 py-0.5 text-xs">
          Authorization
        </code>{' '}
        header:
      </p>
      <CodeBlock>{`Authorization: Bearer YOUR_API_KEY`}</CodeBlock>
    </section>
  );
}
