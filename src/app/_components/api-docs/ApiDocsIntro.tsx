import { Code2 } from 'lucide-react';

export function ApiDocsIntro() {
  return (
    <div className="mb-10">
      <div className="mb-3 flex items-center gap-2">
        <Code2 className="text-primary h-6 w-6" />
        <h1 className="text-3xl font-bold">API Reference</h1>
      </div>
      <p className="text-muted-foreground text-lg">
        Integrate ImgText into your pipeline using the REST API.
      </p>
    </div>
  );
}
