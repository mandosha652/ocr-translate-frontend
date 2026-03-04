import { CodeBlock } from './CodeBlock';

export function BaseUrlSection() {
  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-xl font-semibold">Base URL</h2>
      <CodeBlock>{`https://api.imgtext.io`}</CodeBlock>
      <p className="text-muted-foreground text-sm">
        All endpoints are versioned under{' '}
        <code className="bg-muted rounded px-1 py-0.5 text-xs">/api/v1</code>.
      </p>
    </section>
  );
}
